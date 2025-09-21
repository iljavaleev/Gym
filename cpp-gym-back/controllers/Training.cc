#include "Training.h"
#include <format>
#include "utils/utils.hpp"



constexpr std::string_view GETQUERY = "select w.date date, w.count count, e.id id, e.title title, / 
    l.reps reps, l.expect expect, l.fact fact from Workout w join Load l on w.id=l.workout /
    join Exercise e on e.id=w.exercise where w.date={} and w.user_id={} / 
    order by w.count, l.id";
constexpr std::string_view GETSUBQ = "(select w.date from Workout w where /
            w.date>={} and w.user_id={} order by w.date limit 1)";


std::unique_ptr<Json::Value> Training::getOne(size_t user_id, 
    std::string_view date,
    drogon::orm::DbClientPtr clientPtr = drogon::app().getDbClient()) const
{
    std::unique_ptr<Json::Value> userTraining = std::make_unique<Json::Value>();
    Json::Value training(Json::arrayValue);
    
    std::string query;
    if (not date.empty())
    {
        auto args = std::make_format_args(date.data(), user_id);
        query = std::vformat(GETQUERY, args);
    }
    else
    {
        auto args = std::make_format_args(date.data(), user_id);
        std::string subq = std::vformat(GETSUBQ, args)
        query = std::vformat(std::move(subq), args)
    }
    
    auto res_future = clientPtr->execSqlAsyncFuture(query);
    try
    {
        auto result = res_future.get();
        
        auto first = result.begin();
        userTraining->operator()["date"] = first["date"].as<std::string>();
        int count = first["count"].as<int>();
        
        Json::Value userWorkout; // count exercise load[]
        userWorkout["count"] = first["count"].as<int>();

        Json::Value exercise;
        exercise["id"] = row["id"].as<int>();
        exercise["title"] = row["title"].as<std::string>();
        
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
                
                userWorkout["exercise"] = ex;
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
        userTraining->operator()["training"] = std::move(training);
        return userTraining;
    }
    catch(const std::exception& e)
    {
        LOGGER->error(e.what());
        return nullptr;
    }

    return nullptr;
}

std::unique_ptr<Json::Value> Training::addOne(size_t user_id, 
    std::string_view date, drogon::orm::DbClientPtr clientPtr = 
    drogon::app().getDbClient()) const
{
    return nullptr;
}


int Training::deleteOne(size_t user_id, std::string_view date, 
    drogon::orm::DbClientPtr clientPtr = drogon::app().getDbClient()) const
{
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
    std::unique_ptr<Json::Value> training = 
        getOne((*jsonUser)["user"]["id"].asInt());

    auto resp=HttpResponse::newHttpJsonResponse(*training);
    resp->setStatusCode(drogon::HttpStatusCode::k200OK);
    callback(resp);
}


void Training::postTraining(const HttpRequestPtr &req,
            std::function<void (const HttpResponsePtr &)> &&callback) const
{

}
    

void Training::deleteTraining(const HttpRequestPtr &req,
            std::function<void (const HttpResponsePtr &)> &&callback) const
{

}
