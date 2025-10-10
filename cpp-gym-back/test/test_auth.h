#pragma once

#include <format>

#include "test_utils.h"
#include "models/GymUser.h"


using drogon_model::cpp_gymdb::GymUser;
using drogon::orm::Criteria;
using drogon::orm::CompareOperator;
using drogon::orm::Mapper;
using drogon::orm::DbClient;

using namespace drogon;


DROGON_TEST(RegisterTest)
{
    auto client = HttpClient::newHttpClient("http://localhost:8000");
    auto req = HttpRequest::newHttpRequest();
    
    std::string_view username = "test_user@user.com";
    std::string_view password = "12345678";
    std::string query = std::vformat(formData, 
        std::make_format_args(username, password)); 

    req->setMethod(HttpMethod::Post);
    req->setCustomContentTypeString("multipart/form-data; \
        boundary=----WebKitFormBoundaryQNqmXS3BzShRSspa");
    
    req->setBody(query);
    req->setPath("/api/v1/register");
    client->sendRequest(req, [username, TEST_CTX](
        ReqResult res, const HttpResponsePtr& resp) 
    {
        REQUIRE(res == ReqResult::Ok);
        REQUIRE(resp != nullptr);

        CHECK(resp->getStatusCode() == k201Created);
        CHECK(resp->contentType() == CT_APPLICATION_JSON);
        
        std::shared_ptr<Json::Value> jresp = stringToJson(resp->getBody());
        REQUIRE(jresp->isMember("access_token"));
        REQUIRE((*jresp)["token_type"] == "bearer");

        Mapper<GymUser> gymUserMapper(cl);
        auto count = gymUserMapper.deleteBy(
            Criteria(GymUser::Cols::_email, CompareOperator::EQ, username));
    
        REQUIRE(count == 1);
    });

}

DROGON_TEST(LoginTest)
{
    std::string_view username = "test_user_login@user.com";
    std::string_view password = "12345678";
    std::shared_ptr<GymUser> user = addUser(username, password, cl);
    REQUIRE(user != nullptr);

    auto client = HttpClient::newHttpClient("http://localhost:8000");
    auto req = HttpRequest::newHttpRequest();
    std::string query = std::vformat(formData, 
        std::make_format_args(username, password)); 

    req->setMethod(HttpMethod::Post);
    req->setCustomContentTypeString("multipart/form-data; \
        boundary=----WebKitFormBoundaryQNqmXS3BzShRSspa");
    
    req->setBody(query);
    req->setPath("/api/v1/login");

    client->sendRequest(req, [username, TEST_CTX](
        ReqResult res, const HttpResponsePtr& resp) 
    {
        REQUIRE(res == ReqResult::Ok);
        REQUIRE(resp != nullptr);

        CHECK(resp->getStatusCode() == k201Created);
        CHECK(resp->contentType() == CT_APPLICATION_JSON);
        std::shared_ptr<Json::Value> jresp = stringToJson(resp->getBody());
        REQUIRE(jresp->isMember("access_token"));
        REQUIRE((*jresp)["token_type"] == "bearer");
        
        Mapper<GymUser> gymUserMapper(cl);
        auto count = gymUserMapper.deleteBy(
            Criteria(GymUser::Cols::_email, CompareOperator::EQ, username));
    
        REQUIRE(count == 1);
    });
}
