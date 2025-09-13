#pragma once

#include <drogon/HttpMiddleware.h>

using namespace drogon;


class AuthMiddleware : public HttpMiddleware<AuthMiddleware>
{
public:
    AuthMiddleware(){};

    void invoke(const HttpRequestPtr &req,
                MiddlewareNextCallback &&nextCb,
                MiddlewareCallback &&mcb) override;
                
    std::string get_token(const HttpRequestPtr&);
};

