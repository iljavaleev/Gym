#ifndef UTILS_HPP
#define UTILS_HPP

#include <cstdlib>
#include <string>
#include <memory>
#include <jwt-cpp/jwt.h>
#include <string_view>
#include <drogon/HttpAppFramework.h>

#include "models/GymUser.h"
#include "spdlog/async.h"
#include "spdlog/sinks/basic_file_sink.h"

using drogon_model::cpp_gymdb::GymUser;

const std::string SECRET_KEY = std::getenv("SECRET_KEY");
const std::string ALGORITHM = std::getenv("ALGORITHM");
const int ACCESS_TOKEN_EXPIRE_MINUTES = std::stoi(std::getenv("ACCESS_TOKEN_EXPIRE_MINUTES"));

inline std::shared_ptr<spdlog::logger> LOGGER = spdlog::basic_logger_mt<spdlog::async_factory>(
    "logger", "../logs/error_logs.txt");

bool validateEmail(std::string_view);
bool verifyPassword(std::string_view, std::string_view);
bool validatePassword(std::string_view);


std::string getPasswordHash(std::string_view);

std::shared_ptr<GymUser> addUser(std::string_view, std::string_view, 
    drogon::orm::DbClientPtr);

std::shared_ptr<GymUser> getUser(std::string_view, 
    drogon::orm::DbClientPtr = drogon::app().getDbClient());
    
std::shared_ptr<GymUser> authenticateUser(std::string_view, std::string_view, 
    drogon::orm::DbClientPtr);

std::string createAccessToken(Json::Value&);

std::string decodeAccesToken(std::string_view token, std::string_view secret = SECRET_KEY, 
    drogon::orm::DbClientPtr = drogon::app().getDbClient());


template<typename F>
void sendBadRequest(F&& callback, std::string&& message, 
    drogon::HttpStatusCode status=drogon::HttpStatusCode::k400BadRequest)
{
    Json::Value ret;
    ret["result"] = "failed";
    ret["message"] = std::move(message);
    auto resp = drogon::HttpResponse::newHttpJsonResponse(ret);
    resp->setStatusCode(status);
    callback(resp);
}

#endif