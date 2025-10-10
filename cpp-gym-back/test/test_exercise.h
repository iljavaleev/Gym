#pragma once

#include <drogon/drogon_test.h>
#include <drogon/drogon.h>

#include "test_auth.h"


using drogon_model::cpp_gymdb::GymUser;
using drogon_model::cpp_gymdb::UserExercise;
using drogon::orm::Criteria;
using drogon::orm::CompareOperator;
using drogon::orm::Mapper;
using drogon::orm::DbClient;

using namespace  drogon;


DROGON_TEST(ExerciseTest)
{
    auto client = HttpClient::newHttpClient("http://localhost:8000");
    
    std::string_view username = "test_user_ex1@user.com";
    std::string_view password = "12345678";
    std::string token = getToken(username, password, cl);
    
    auto req = createRequest(token, "/api/v1/user-exercise"); 
    req->setMethod(HttpMethod::Post);
    
    Json::Value body;
    body["title"] = "test exercise";
    req->setBody(body.toStyledString());
    
    
    client->sendRequest(req, [username, token, TEST_CTX](
        ReqResult res, const HttpResponsePtr& resp) 
    {
        REQUIRE(res == ReqResult::Ok);
        REQUIRE(resp != nullptr);

        CHECK(resp->getStatusCode() == k201Created);
        CHECK(resp->contentType() == CT_APPLICATION_JSON);
        
        std::shared_ptr<Json::Value> jresp = stringToJson(resp->getBody());
        REQUIRE(jresp->isMember("title"));
        REQUIRE((*jresp)["title"] == "test exercise");
        

        auto client = HttpClient::newHttpClient("http://localhost:8000");    
        
        auto req = createRequest(token, "/api/v1/user-exercise"); 
        req->setMethod(HttpMethod::Get);
    
         client->sendRequest(req, [username, token, TEST_CTX](
            ReqResult res, const HttpResponsePtr& resp) 
        {
            REQUIRE(res == ReqResult::Ok);
            REQUIRE(resp != nullptr);

            CHECK(resp->getStatusCode() == k200OK);
            CHECK(resp->contentType() == CT_APPLICATION_JSON);
            
            std::shared_ptr<Json::Value> jresp = stringToJson(resp->getBody());
            REQUIRE(jresp->isArray());

            REQUIRE((*jresp)[0]["title"] == "test exercise");

            int id = (*jresp)[0]["id"].asInt();

            auto client = HttpClient::newHttpClient("http://localhost:8000");
            
            auto req = createRequest(token, "/api/v1/user-exercise");        
            req->setMethod(HttpMethod::Delete);
            req->setParameter("id", std::to_string(id));

            client->sendRequest(req, [username, token, id, TEST_CTX](
                ReqResult res, const HttpResponsePtr& resp) 
            {
                CHECK(resp->getStatusCode() == k200OK);
                
                Mapper<UserExercise> userExMapper(cl);
                std::vector<UserExercise> ex = 
                    userExMapper.findBy(
                        Criteria(UserExercise::Cols::_id, CompareOperator::EQ, id));
                REQUIRE(ex.empty());

                Mapper<GymUser> gymUserMapper(cl);
                auto count = gymUserMapper.deleteBy(
                    Criteria(GymUser::Cols::_email, CompareOperator::EQ, 
                        username));
        
                REQUIRE(count == 1);
            });
        });
    });
}
  