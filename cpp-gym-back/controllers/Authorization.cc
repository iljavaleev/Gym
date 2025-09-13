#include "Authorization.h"

#include "utils/utils.hpp"

#include "models/GymUser.h"

#include "bcrypt.h"

#include <iostream>
#include <memory>


using drogon::orm::Criteria;
using drogon::orm::CompareOperator;
using drogon::orm::Mapper;

using drogon_model::cpp_gymdb::GymUser;

void Authorization::registration(const HttpRequestPtr &req,
                 std::function<void (const HttpResponsePtr &)> &&callback) const
{
    std::shared_ptr<Json::Value> juser = req->jsonObject();
    Json::Value ret;
    
    if (!juser)
    {
        sendBadRequest(callback, "Data error");
        return;
    }

    if (!(validateEmail((*juser)["email"].asString()) &&   
                validatePassword((*juser)["password"].asString()))) 
    {
        sendBadRequest(callback, "Validation error");
        return;
    }
    
    auto user = getUser((*juser)["emal"].asString());
    
    if (user)
    {
        sendBadRequest(callback, "User with this username or email already exist");
        return;
    }
    
    std::string hash_passw = bcrypt::generateHash((*juser)["password"].asString());

    juser->removeMember("password");
    (*juser)["hashed_password"] = std::move(hash_passw);
    
    
    auto maybe_user = addUser(GymUser(*juser));

    if (not maybe_user)
    {
        LOG_ERROR << "Error while creating user";
        sendBadRequest(callback, "Error while creating user");
        return;
    }
    
    juser->removeMember("hashed_password");
    ret["message"] = "User created";
    ret["user"] = *juser;
    
    auto resp=HttpResponse::newHttpJsonResponse(ret);
    resp->setStatusCode(drogon::HttpStatusCode::k201Created);
    callback(resp);
}



void Authorization::login(const HttpRequestPtr &req,
                 std::function<void (const HttpResponsePtr &)> &&callback) const
{
    
    std::shared_ptr<Json::Value> credentials = req->getJsonObject();
    if (!credentials)
    {
        sendBadRequest(callback, "You must provide username and password in json format");
        return;
    }
    
    if (not (credentials->isMember("username") && 
        credentials->isMember("password")))    
    {
        sendBadRequest(callback, "You must provide username and password");
        return;
    }
    
    auto m_user = getUser((*credentials)["username"].asString());

    if (not m_user || not verifyPassword(
        (*credentials)["password"].asString(), *m_user->getHashedPassword()))
    {
        sendBadRequest(callback, 
            "Incorrect username or password", 
            drogon::HttpStatusCode::k401Unauthorized);
        return;
    }
    
    Json::Value data;
    data["username"] = *m_user->getUsername();
    std::string token = createAccessToken(data);
    
    Json::Value ret;
    ret["access_token"] = std::move(token);
    ret["token_type"] = "bearer";
    auto resp=HttpResponse::newHttpJsonResponse(ret);
    resp->setStatusCode(drogon::HttpStatusCode::k201Created);
    callback(resp);
}
