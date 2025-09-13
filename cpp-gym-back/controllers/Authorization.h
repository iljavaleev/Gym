#pragma once

#include <drogon/HttpController.h>

using namespace drogon;

class Authorization : public drogon::HttpController<Authorization>
{
  public:
    METHOD_LIST_BEGIN
      ADD_METHOD_TO(Authorization::login, "/api/v1/login", Post); 
      ADD_METHOD_TO(Authorization::registration, "/api/v1/register", Post);
    METHOD_LIST_END

    void  registration(const HttpRequestPtr &req,
                std::function<void (const HttpResponsePtr &)> &&callback) const;
    void  login(const HttpRequestPtr &req,
                std::function<void (const HttpResponsePtr &)> &&callback) const;
  
};
