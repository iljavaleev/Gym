#pragma once

#include <drogon/HttpController.h>
#include "models/UserExercise.h"

using namespace drogon;
using drogon_model::cpp_gymdb::UserExercise;


class Generic : public drogon::HttpController<Generic>
{
  template<typename T>
    std::unique_ptr<std::vector<T>> getWork(int number, 
      drogon::orm::DbClientPtr clientPtr = drogon::app().getDbClient()) const;

  public:
    METHOD_LIST_BEGIN
      ADD_METHOD_TO(Generic::seacrh, "/api/v1/search", Get);
    METHOD_LIST_END
    
    
    void seacrh(const HttpRequestPtr &req,
            std::function<void (const HttpResponsePtr &)> &&callback) const;

};
