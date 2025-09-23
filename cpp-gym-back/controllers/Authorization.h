#pragma once

#include <drogon/HttpController.h>
#include <memory>

using namespace drogon;

class Authorization : public drogon::HttpController<Authorization>
{
  struct form_data
  {
    std::string email;
    std::string password;
  };
  
  public:
    METHOD_LIST_BEGIN
      ADD_METHOD_TO(Authorization::login, "/api/v1/login", Post); 
      ADD_METHOD_TO(Authorization::registration, "/api/v1/register", Post);
    METHOD_LIST_END

    void registration(const HttpRequestPtr &req,
                std::function<void (const HttpResponsePtr &)> &&callback) const;
    void login(const HttpRequestPtr &req,
                std::function<void (const HttpResponsePtr &)> &&callback) const;

    std::unique_ptr<form_data> getFormData(const HttpRequestPtr &req,
      std::function<void (const HttpResponsePtr &)> &&callback) const;

    void sendToken(std::string_view email, int32_t id, 
      std::function<void (const HttpResponsePtr &)> &&callback) const;
  
};
