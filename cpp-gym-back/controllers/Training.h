#pragma once

#include <drogon/HttpController.h>

using namespace drogon;


class Training : public drogon::HttpController<Training>
{
  std::unique_ptr<Json::Value> getOne(int user_id, std::string_view date,
    drogon::orm::DbClientPtr clientPtr = drogon::app().getDbClient()) const;
  
  int addAll(int user_id, std::string_view date, 
    const Json::Value& training,
    drogon::orm::DbClientPtr clientPtr = drogon::app().getDbClient()) const;
    
  int deleteOne(int user_id, std::string_view date, 
    drogon::orm::DbClientPtr clientPtr = drogon::app().getDbClient()) const;

  public:
    METHOD_LIST_BEGIN
      ADD_METHOD_TO(Training::getTraining, "/api/v1/user-training", Get, 
        "AuthMiddleware");
      ADD_METHOD_TO(Training::getTraining, "/api/v1/user-next-training", Get, 
        "AuthMiddleware");  
      ADD_METHOD_TO(Training::postTraining, "/api/v1/user-training", Post, 
        "AuthMiddleware"); 
      ADD_METHOD_TO(Training::deleteTraining, "/api/v1/user-training", Delete, 
        "AuthMiddleware"); 
    METHOD_LIST_END
    
    
    void getTraining(const HttpRequestPtr &req,
            std::function<void (const HttpResponsePtr &)> &&callback) const;
    void postTraining(const HttpRequestPtr &req,
            std::function<void (const HttpResponsePtr &)> &&callback) const;
    void deleteTraining(const HttpRequestPtr &req,
            std::function<void (const HttpResponsePtr &)> &&callback) const;
};
