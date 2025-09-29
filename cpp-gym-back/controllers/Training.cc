#include "Training.h"
#include <format>
#include "utils/utils.hpp"
#include "models/Workout.h"
#include "models/Load.h"

using drogon_model::cpp_gymdb::Workout;
using drogon_model::cpp_gymdb::Load;

using drogon::orm::Criteria;
using drogon::orm::CompareOperator;
using drogon::orm::Mapper;

constexpr std::string_view GETQUERY = "select w.date date, w.count count," 
    " e.id id, e.title title, l.reps reps, l.expect expect, l.fact fact from"
    " Workout w join Load l on w.id=l.workout join User_exercise e on" 
    " e.id=w.exercise where w.date={} and w.user_id={} order by w.count, l.id";

constexpr std::string_view GETSUBQ = "(select w.date from Workout w where w.date>=\'{}\'::timestamp and w.user_id={} order by w.date limit 1)";


std::unique_ptr<Json::Value> Training::getOne(size_t user_id, 
    std::string_view date, drogon::orm::DbClientPtr clientPtr) const
{
    std::unique_ptr<Json::Value> userTraining = std::make_unique<Json::Value>();
    Json::Value training(Json::arrayValue);
    std::string query;
    
    if (not date.empty())
    {
        auto args = std::make_format_args(date, user_id);
        query = std::vformat(GETQUERY, args);
    }
    else
    {
        auto date = trantor::Date::date().toCustomFormattedString("%Y-%m-%d %H:%M:%S");
        auto args = std::make_format_args(date, user_id);
        std::string subq = std::vformat(GETSUBQ, args);
        args = std::make_format_args(subq, user_id);
        query = std::vformat(GETQUERY, args);
    }
    LOG_ERROR << query;
    auto res_future = clientPtr->execSqlAsyncFuture(query);
    try
    {
        auto result = res_future.get();
        
        auto first = result.begin();
        (*userTraining)["date"] = (*first)["date"].as<std::string>();
        int count = (*first)["count"].as<int>();
        
        Json::Value userWorkout; // count exercise load[]
        userWorkout["count"] = (*first)["count"].as<int>();

        Json::Value exercise;
        exercise["id"] = (*first)["id"].as<int>();
        exercise["title"] = (*first)["title"].as<std::string>();
        
        userWorkout["exercise"] = exercise;

        Json::Value load(Json::arrayValue);

        for (const auto& row : result)
        {
            if (row["count"].as<int>() != count)
            {
                userWorkout["load"] = load;
                training.append(userWorkout);

                count = row["count"].as<int>();

                exercise["id"] = row["id"].as<int>();
                exercise["title"] = row["title"].as<std::string>();
                
                userWorkout["exercise"] = exercise;
                userWorkout["count"] = count;
                load.clear();
            }
            Json::Value subload;
            subload["reps"] = row["reps"].as<int>();
            subload["expect"] = row["expect"].as<int>();
            subload["fact"] = row["fact"].as<int>();
            load.append(std::move(subload));
        }
        userWorkout["load"] = load;
        training.append(userWorkout);
        (*userTraining)["training"] = std::move(training);
        return userTraining;
    }
    catch(const std::exception& e)
    {
        LOGGER->error(e.what());
        return nullptr;
    }

    return nullptr;
}

int Training::addAll(size_t user_id, 
    std::string_view date, const Json::Value& training, 
    drogon::orm::DbClientPtr clientPtr) const
{
    std::string uid;
    auto transPtr = clientPtr->newTransaction();
    try
    {
        for (Json::ArrayIndex i = 0; i < training.size(); ++i) 
        {
            const Json::Value& element = training[i];
            uid = drogon::utils::getUuid();
            
            auto w_fut = transPtr->execSqlAsyncFuture(
                "INSERT INTO workout VALUES($1, $2, $3, $4, $5)", 
                uid, element["count"].asInt(), static_cast<int>(user_id), 
                element["exercise"]["id"].asInt(), date.data());
            
            w_fut.get();

            for (Json::ArrayIndex j = 0; j < element["load"].size(); ++j)
            {
                auto l = element["load"][j];
                if (l["reps"].empty())
                    return -1;

                auto l_fut = transPtr->execSqlAsyncFuture(
                    "INSERT INTO load(workout, reps, expect, fact) \
                    VALUES($1, $2, $3, $4)", uid, l["reps"].asInt(), 
                    (!l["expect"].empty() ? l["expect"].asInt() : 0), 
                    (!l["fact"].empty() ? l["fact"].asInt() : 0));
                
                l_fut.get();
            }   
        }
    }
    catch(const std::exception& e)
    {
        LOGGER->error(e.what());
        return -1;
    }
   
    return 0;
} 
    


int Training::deleteOne(int user_id, std::string_view date, 
    drogon::orm::DbClientPtr clientPtr) const
{
    Mapper<Workout> mp(clientPtr);
    try
    {
        auto res_future = mp.deleteFutureBy(
            Criteria(Workout::Cols::_user_id, CompareOperator::EQ, user_id)
            && 
            Criteria(Workout::Cols::_date, CompareOperator::EQ, date)
        );
        
        return res_future.get();
    }
    catch(const std::exception& e)
    {

        LOGGER->error(e.what());
        return -1;
    }
    
    return {};
}


void Training::getTraining(const HttpRequestPtr &req,
            std::function<void (const HttpResponsePtr &)> &&callback) const
{
    std::unique_ptr<Json::Value> jsonUser = stringToJson(req->getBody());
    if (not jsonUser)
    {
        sendBadRequest(callback, "Server error", 
            drogon::HttpStatusCode::k500InternalServerError);
        return;
    }
    auto params = req->getParameters();
    std::string_view training_date; 
    if (params.contains("date") && not params.at("date").empty())
        training_date = params.at("date");
    
    std::unique_ptr<Json::Value> training = 
        getOne((*jsonUser)["user"]["id"].asInt(), training_date);

    auto resp=HttpResponse::newHttpJsonResponse(*training);
    resp->setStatusCode(drogon::HttpStatusCode::k200OK);
    callback(resp);
}


void Training::postTraining(const HttpRequestPtr &req,
            std::function<void (const HttpResponsePtr &)> &&callback) const
{
    std::unique_ptr<Json::Value> body = stringToJson(req->getBody());
    if (not body)
    {
        LOGGER->error("Error parse body to json");
        sendBadRequest(callback, "Server error", 
            drogon::HttpStatusCode::k500InternalServerError);
        return;
    }
    
    int user_id = (*body)["user"]["id"].asInt();
    std::string_view date = (*body)["date"].asCString();
    
    if (deleteOne(user_id, date) == -1)
    {
        LOGGER->error(std::format(
            "Error delete workout for user {} with date {}", user_id, date));
        sendBadRequest(callback, "Server error", 
            drogon::HttpStatusCode::k500InternalServerError);
        return;
    }

    Json::Value training = (*body)["training"];
    if (not training.isArray() || training.empty()) 
    {
        sendBadRequest(callback, "Server error", 
            drogon::HttpStatusCode::k400BadRequest);
        return;
    }
    
    if (addAll(user_id, date, training) == -1)
    {
        LOGGER->error("DB error");
        sendBadRequest(callback, "Bad request", 
            drogon::HttpStatusCode::k400BadRequest);
        return;
    }

    body->removeMember("user");
    auto resp=HttpResponse::newHttpJsonResponse(*body);
    resp->setStatusCode(drogon::HttpStatusCode::k201Created);
    callback(resp);
}

    
void Training::deleteTraining(const HttpRequestPtr &req,
            std::function<void (const HttpResponsePtr &)> &&callback) const
{
    std::unique_ptr<Json::Value> jsonUser = stringToJson(req->getBody());
    if (not jsonUser)
    {
        sendBadRequest(callback, "Server error", 
            drogon::HttpStatusCode::k500InternalServerError);
        return;
    }

    auto params = req->getParameters();
    if (not params.contains("date") || params.at("date").empty())
    {
        sendBadRequest(callback, "Error query params", 
            drogon::HttpStatusCode::k400BadRequest);
        return;
    }

    std::string_view training_date = params.at("date");
    auto user_id = (*jsonUser)["user"]["id"].asInt();

    if (deleteOne(user_id, training_date) == -1)
    {
        sendBadRequest(callback, "Server error", 
            drogon::HttpStatusCode::k500InternalServerError);
        return;
    }
    
    auto resp=HttpResponse::newHttpJsonResponse(Json::Value());
    resp->setStatusCode(drogon::HttpStatusCode::k200OK);
    callback(resp);
}
