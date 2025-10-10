#pragma once

#include <drogon/HttpController.h>
#include "models/UserExercise.h"

using namespace drogon;
using drogon_model::cpp_gymdb::UserExercise;

class Exercise : public drogon::HttpController<Exercise>
{
  std::unique_ptr<std::vector<UserExercise>> getAll(int user_id, 
    drogon::orm::DbClientPtr clientPtr = drogon::app().getDbClient()) const;
  
  std::unique_ptr<UserExercise> addOne(int user_id, std::string_view title, 
    drogon::orm::DbClientPtr clientPtr = drogon::app().getDbClient()) const;

  int deleteOne(int user_id, int id, drogon::orm::DbClientPtr clientPtr = 
      drogon::app().getDbClient()) const;

  public:
    METHOD_LIST_BEGIN
      ADD_METHOD_TO(Exercise::getExercise, "/api/v1/user-exercise", Get, 
        "AuthMiddleware"); 
      ADD_METHOD_TO(Exercise::postExercise, "/api/v1/user-exercise", Post, 
        "AuthMiddleware"); 
      ADD_METHOD_TO(Exercise::deleteExercise, "/api/v1/user-exercise", Delete, 
        "AuthMiddleware"); 
    METHOD_LIST_END

  void getExercise(const HttpRequestPtr &req,
            std::function<void (const HttpResponsePtr &)> &&callback) const;

  void postExercise(const HttpRequestPtr &req,
                std::function<void (const HttpResponsePtr &)> &&callback) const;
  
  void deleteExercise(const HttpRequestPtr &req,
                std::function<void (const HttpResponsePtr &)> &&callback) const;  
};
