#include "Authorization.h"
#include "utils/utils.hpp"
#include "models/GymUser.h"
#include "bcrypt.h"

#include <iostream>
#include <memory>
#include <drogon/drogon.h>


using drogon::orm::Criteria;
using drogon::orm::CompareOperator;
using drogon::orm::Mapper;

using drogon_model::cpp_gymdb::GymUser;


std::unique_ptr<Authorization::form_data> Authorization::getFormData(const HttpRequestPtr &req,
      std::function<void (const HttpResponsePtr &)> &&callback) const
{
    drogon::MultiPartParser parser;
    if (parser.parse(req))
    {
        sendBadRequest(callback, "Invalid form data");
        return nullptr;
    }
        
    auto parameters = parser.getParameters();
   
    if (not parameters.contains("username") || 
        not validateEmail(parameters.at("username")) || 
        not parameters.contains("password") ||
        not validatePassword(parameters.at("password"))
    )
    {
        sendBadRequest(callback, "Invalid form data");
        return nullptr;
    }
        
    return std::make_unique<form_data>(
        parameters.at("username"), parameters.at("password"));
}  


void Authorization::sendToken(std::string_view email, int32_t id, 
      std::function<void (const HttpResponsePtr &)> &&callback) const
{
    Json::Value data;
    data["sub"] = email.data();
    data["user_id"] = id;

    std::string accessToken = createAccessToken(data);

    data.clear();
    data["access_token"] = std::move(accessToken);
    data["token_type"] = "bearer";


    auto resp=HttpResponse::newHttpJsonResponse(data);
    resp->setStatusCode(drogon::HttpStatusCode::k201Created);
    callback(resp);
}
  

void Authorization::registration(const HttpRequestPtr &req,
                 std::function<void (const HttpResponsePtr &)> &&callback) const
{
    std::function<void (const HttpResponsePtr &)> cbk{callback};
    std::unique_ptr<form_data> params = getFormData(req, std::move(cbk));
    if (not params)
        return;

    if (getUser(params->email))
        sendBadRequest(callback, "User with this email already exists", 
            drogon::HttpStatusCode::k401Unauthorized);
    
    
    std::shared_ptr<GymUser> user = addUser(params->email, 
        params->password);
    
    if (!user)
    {
        sendBadRequest(callback, "Database error", 
            drogon::HttpStatusCode::k500InternalServerError);
    }
    
    sendToken(params->email, user->getValueOfId(), std::move(callback));
}


void Authorization::login(const HttpRequestPtr &req,
                 std::function<void (const HttpResponsePtr &)> &&callback) const
{
    std::function<void (const HttpResponsePtr &)> cbk{callback};
    std::unique_ptr<form_data> params = getFormData(req, std::move(cbk));

    std::shared_ptr<GymUser> user = authenticateUser(params->email, 
        params->password);
    if(not user)
    {
         sendBadRequest(callback, "Incorrect email or password", 
            drogon::HttpStatusCode::k401Unauthorized);
    }

    sendToken(params->email, user->getValueOfId(), std::move(callback));
}
