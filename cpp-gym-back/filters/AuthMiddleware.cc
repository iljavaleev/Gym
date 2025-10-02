#include "AuthMiddleware.h"
#include <ranges>
#include <memory>
#include <drogon/drogon.h>

#include "models/GymUser.h"
#include "utils/utils.hpp"


using drogon_model::cpp_gymdb::GymUser;


void AuthMiddleware::invoke(const HttpRequestPtr &req,
            MiddlewareNextCallback &&nextCb,
            MiddlewareCallback &&mcb)
{
    std::string token = getToken(req);
    if (not token.size())
    {
        sendBadRequest(mcb, "Token not found error");
        return;
    }
    
    std::string email = decodeAccesToken(token);
    std::shared_ptr<GymUser> user;
    if (not email.length())
    {
        sendBadRequest(mcb, "Token error");
        return;
    }
    
    if (email.length())
        user = getUser(std::move(email));

    if (!user)
    {
        sendBadRequest(mcb, "User not found");
        return;
    }
    std::string_view body = req->getBody();
    std::unique_ptr<Json::Value> jsonBody = stringToJson(body);
    
    Json::Value res;
    if (jsonBody)
    {
        res = *jsonBody;
    }
    res["user"] = (*user).toJson();
    req->setBody(res.toStyledString());
    nextCb([mcb = std::move(mcb)](const HttpResponsePtr &resp) 
    {
            mcb(resp);
    });
}


std::string AuthMiddleware::getToken(const HttpRequestPtr &req)
{
    std::string token;
    token = req->getHeader("Authorization");
    if (!token.size())
    {
        const std::shared_ptr<Json::Value>& body = req->getJsonObject();
        if (not body || not body->isMember("token"))
        {
            return {};
        }
        
        return body->operator[]("token").asString();
    }

    auto s = std::views::split(token, ' ');
    std::vector v(s.begin(), s.end()); 
    
    auto lower_header = std::string_view(v.at(0).begin(), v.at(0).end()) | 
        std::views::transform([](unsigned char c){ return std::tolower(c); });
    
    if (std::string(lower_header.begin(), lower_header.end()) != "bearer")
    {
        return {};
    }
    
    return {v.at(1).begin(), v.at(1).end()};
}
