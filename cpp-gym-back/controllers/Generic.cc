#include "Generic.h"
#include "utils/utils.hpp"
#include "models/Endurance.h"
#include "models/Strength.h"
#include <ranges>
#include <tuple>

using drogon_model::cpp_gymdb::Endurance;
using drogon_model::cpp_gymdb::Strength;

using drogon::orm::Criteria;
using drogon::orm::CompareOperator;
using drogon::orm::Mapper;


template<typename T>
std::unique_ptr<std::vector<T>> Generic::getWork(int number, 
    drogon::orm::DbClientPtr clientPtr) const
{
    Mapper<T> mp(clientPtr);
    try
    {   
        auto res_future = mp.findFutureBy(Criteria(T::Cols::_work_id, 
            CompareOperator::EQ, number));
        return std::make_unique<std::vector<T>>(std::move(res_future.get()));
    }
    catch(const std::exception& e)
    {

        LOGGER->error(e.what());
        return nullptr;
    }
    return nullptr;
}


void Generic::seacrh(const HttpRequestPtr &req,
            std::function<void (const HttpResponsePtr &)> &&callback) const
{
    auto params = req->getParameters();
    if (not params.contains("book") || params.at("book").empty() ||
        not params.contains("number") || params.at("number").empty())
    {
        sendBadRequest(callback, "Error query params", 
            drogon::HttpStatusCode::k400BadRequest);
        return;
    }

    int number = std::stoi(params.at("number"));
    Json::Value data(Json::arrayValue);
    
    if (params.at("book") == "1")
    {
        std::unique_ptr<std::vector<Endurance>> work = 
            getWork<Endurance>(number);

        for (const auto& e: *work)
        { 
            Json::Value val;
            
            val["exercise"] = e.getValueOfExercise();
            if (e.getValueOfReps().length())
                val["reps"] = e.getValueOfReps();
            if (e.getValueOfSuperset())
                val["superset"] = e.getValueOfSuperset();
            data.append(std::move(val));
        }
    }
    
    if (params.at("book") == "0")
    {
        std::unique_ptr<std::vector<Strength>> work = getWork<Strength>(number);
    
        for (const auto& s: *work)
        { 
            Json::Value val;
            val["exercise"] = s.getValueOfExercise();
            if (s.getValueOfReps().length())
                val["reps"] = s.getValueOfReps();
            data.append(std::move(val));
        }
    }
    
    auto resp=HttpResponse::newHttpJsonResponse(data);
    resp->setStatusCode(drogon::HttpStatusCode::k200OK);
    callback(resp);
}
