#include "Exercise.h"
#include "utils/utils.hpp"


using drogon_model::cpp_gymdb::UserExercise;
using drogon::orm::Criteria;
using drogon::orm::CompareOperator;
using drogon::orm::Mapper;


std::unique_ptr<std::vector<UserExercise>> Exercise::getAll(size_t user_id, 
    drogon::orm::DbClientPtr clientPtr) const
{
    Mapper<UserExercise> mp(clientPtr);
    try
    {
        auto res_future = mp.findFutureBy(Criteria(UserExercise::Cols::_user_id, 
            CompareOperator::EQ, user_id));
        return std::make_unique<std::vector<UserExercise>>(
            std::move(res_future.get()));
    }
    catch(const std::exception& e)
    {

        LOGGER->error(e.what());
        return nullptr;
    }
    return nullptr;
}


std::unique_ptr<UserExercise> Exercise::addOne(size_t user_id, 
    std::string_view title, drogon::orm::DbClientPtr clientPtr) const
{
    Mapper<UserExercise> mp(clientPtr);
    UserExercise exs;
    exs.setTitle(title.data());
    exs.setUserId(user_id);
    auto res_future = mp.insertFuture(std::move(exs));
    
    try
    {
        return std::make_unique<UserExercise>(res_future.get());
    }
    catch(const std::exception& e)
    {
        LOGGER->error(e.what());
        return nullptr;
    }

    return nullptr;
}


void Exercise::getExercise(const HttpRequestPtr &req,
    std::function<void (const HttpResponsePtr &)> &&callback) const
{
    std::unique_ptr<Json::Value> jsonUser = stringToJson(req->getBody());
    if (not jsonUser)
    {
        sendBadRequest(callback, "Server error", 
            drogon::HttpStatusCode::k500InternalServerError);
        return;
    }
    std::unique_ptr<std::vector<UserExercise>> exercises = 
        getAll((*jsonUser)["user"]["id"].asInt());
    
    Json::Value data(Json::arrayValue);
    for (const auto ex: *exercises)
    {
        Json::Value userEx;
        userEx["id"] = ex.getValueOfId();
        userEx["title"] = ex.getValueOfTitle();
        data.append(std::move(userEx));
    }

    auto resp=HttpResponse::newHttpJsonResponse(data);
    resp->setStatusCode(drogon::HttpStatusCode::k200OK);
    callback(resp);
}

void Exercise::postExercise(const HttpRequestPtr &req,
            std::function<void (const HttpResponsePtr &)> &&callback) const
{
    
    std::unique_ptr<Json::Value> jsonExr = stringToJson(req->getBody());
    if (not jsonExr)
    {
        sendBadRequest(callback, "Server error", 
            drogon::HttpStatusCode::k500InternalServerError);
        return;
    }
    
    if (not jsonExr->isMember("exercise") || 
        not (*jsonExr)["exercise"]["title"])
    {
        sendBadRequest(callback, "Data error", 
            drogon::HttpStatusCode::k400BadRequest);
        return;
    }

    std::unique_ptr<UserExercise> usex = addOne((*jsonExr)["user"]["id"].asInt(), 
        (*jsonExr)["exercise"]["title"].asString());
    
    if (not usex)
    {
        sendBadRequest(callback, "DB error", 
            drogon::HttpStatusCode::k500InternalServerError);
        return;
    }
    
    Json::Value data = usex->toJson();
    data.removeMember("id");

    auto resp = HttpResponse::newHttpJsonResponse(data);
    resp->setStatusCode(drogon::HttpStatusCode::k201Created);
    callback(resp);
}


int Exercise::deleteOne(size_t user_id, size_t id, 
    drogon::orm::DbClientPtr clientPtr) const
{
    Mapper<UserExercise> mp(clientPtr);
    try
    {
        auto res_future = mp.deleteFutureBy(
            Criteria(UserExercise::Cols::_id, CompareOperator::EQ, id) 
            && 
            Criteria(UserExercise::Cols::_user_id, 
                CompareOperator::EQ, user_id)
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


void Exercise::deleteExercise(const HttpRequestPtr &req,
            std::function<void (const HttpResponsePtr &)> &&callback) const
{
    auto queryParams = req->getParameters();
    if (not queryParams.contains("id"))
    {
        sendBadRequest(callback, "Data error", 
            drogon::HttpStatusCode::k400BadRequest);
        return;
    }
    
    std::unique_ptr<Json::Value> jsonUser = stringToJson(req->getBody());
    if (not jsonUser)
    {
        sendBadRequest(callback, "Server error", 
            drogon::HttpStatusCode::k500InternalServerError);
        return;
    }

    int delRes = deleteOne((*jsonUser)["user"]["id"].asInt(), 
        std::stoi(queryParams.at("id")));

    if (not delRes)
    {
        sendBadRequest(callback, "Invalid id", 
            drogon::HttpStatusCode::k400BadRequest);
        return;
    }

    if (delRes == -1)
    {
        sendBadRequest(callback, "DB error", 
            drogon::HttpStatusCode::k500InternalServerError);
        return;
    }

    Json::Value data;
    auto resp=HttpResponse::newHttpJsonResponse(data);
    resp->setStatusCode(drogon::HttpStatusCode::k200OK);
    callback(resp);
}

