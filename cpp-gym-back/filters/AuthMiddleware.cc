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
    std::string token = get_token(req);
    if (not token.size())
    {
        mcb(HttpResponse::newNotFoundResponse(req));
        return;
    }
    
    std::string email = decodeAccesToken(token);
    std::shared_ptr<GymUser> user{nullptr};

    if (email.length())
        user = getUser(std::move(email));

    if (!user)
    {
        mcb(HttpResponse::newNotFoundResponse(req));
        return;
    }
    // drogon::MultiPartParser parser;
   
    // auto json_value = req->getJsonObject();
    // if (json_value)
    // {
    //     (*json_value)["user"] = (*user).toJson();
    // }
    // else
    // {
    //     Json::Value val;
    //     val["user"] = (*user).toJson();
    //     req->setContentTypeString("application/json");
    //     req->setBody(val.toStyledString());
    // }
    
    nextCb([&, mcb = std::move(mcb)](const HttpResponsePtr &resp) 
        {   
            resp->setBody((*user).toJson().toStyledString());
            mcb(resp); 
        }
    );
}


std::string AuthMiddleware::get_token(const HttpRequestPtr &req)
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
