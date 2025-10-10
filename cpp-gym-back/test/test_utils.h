#pragma once
#include <drogon/drogon_test.h>
#include <drogon/drogon.h>
#include "utils/utils.hpp"
#include "models/GymUser.h"
#include "models/UserExercise.h"

using drogon::orm::DbClient;

using namespace  drogon;

std::shared_ptr<DbClient> cl = drogon::orm::DbClient::newPgClient(
    "host=localhost port=5432 dbname=cpp_gymdb password=postgres user=postgres",  
    1);


constexpr std::string_view formData = 
    "------WebKitFormBoundaryQNqmXS3BzShRSspa\r\n"
    "Content-Disposition: form-data; name=\"username\"\r\n\r\n"
    "{}\r\n"
    "------WebKitFormBoundaryQNqmXS3BzShRSspa\r\n"
    "Content-Disposition: form-data; name=\"password\"\r\n\r\n"
    "{}\r\n"
    "------WebKitFormBoundaryQNqmXS3BzShRSspa--\r\n";


constexpr std::string_view trainingData = "{\
    \"date\": \"2025-12-31T10:30:00Z\",\
    \"training\": [{\
        \"count\": 1,\
        \"exercise\": {\"id\": 0},\
        \"load\":[\
            { \"reps\": 1, \"expect\": 10, \"fact\": 100 },\
            { \"reps\": 1, \"expect\": 10, \"fact\": 100 },\
            { \"reps\": 1, \"expect\": 10, \"fact\": 100 }\
        ]\
    },{\
        \"count\": 2,\
        \"exercise\": {\"id\": 0},\
        \"load\":[\
            { \"reps\": 2, \"expect\": 10, \"fact\": 100 },\
            { \"reps\": 2, \"expect\": 10, \"fact\": 100 },\
            { \"reps\": 2, \"expect\": 10, \"fact\": 100 }\
        ]\
    }]\
}";


std::string getToken(std::string_view username, 
    std::string_view password,  
    drogon::orm::DbClientPtr clientPtr)
{
    std::shared_ptr<GymUser> user = addUser(username, password, clientPtr);
    assert(user != nullptr);
    Json::Value data;
    data["sub"] = username.data();
    data["user_id"] = user->getValueOfId();
    return createAccessToken(std::move(data));
}

std::pair<int, std::string> getIdAndToken(std::string_view username, 
    std::string_view password,  
    drogon::orm::DbClientPtr clientPtr)
{
    std::shared_ptr<GymUser> user = addUser(username, password, clientPtr);
    assert(user != nullptr);
    Json::Value data;
    data["sub"] = username.data();
    data["user_id"] = user->getValueOfId();
    return {user->getValueOfId(), createAccessToken(std::move(data))};
}


drogon::HttpRequestPtr createRequest(std::string_view token, 
    std::string_view url)
{
    auto req = HttpRequest::newHttpRequest();
    req->addHeader("Authorization", std::format("Bearer {}", token));
    req->setPath(url.data());
    return req;
}

// "/api/v1/user-exercise"