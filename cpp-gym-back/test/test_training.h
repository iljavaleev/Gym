#pragma once

#include <drogon/drogon_test.h>
#include <drogon/drogon.h>
#include "test_utils.h"
#include "models/Workout.h"
#include "models/Load.h"
#include "models/UserExercise.h"
#include "test_auth.h"
#include <format>

using drogon_model::cpp_gymdb::Workout;
using drogon_model::cpp_gymdb::Load;
using drogon_model::cpp_gymdb::UserExercise;
using drogon::orm::Criteria;
using drogon::orm::CompareOperator;
using drogon::orm::Mapper;
using drogon::orm::DbClient;

using namespace  drogon;


DROGON_TEST(TrainingTest)
{
    std::string_view username = "test_user_tr@user.com";
    std::string_view password = "12345678";
    auto [user_id, token] = getIdAndToken(username, password, cl);

    Mapper<UserExercise> uxMapper(cl);
    Json::Value jex;
    jex["user_id"] = user_id;
    jex["title"] = "test1";
    
    UserExercise s(std::move(jex)), resUX;
    auto fres1 = uxMapper.insertFuture(s);
    resUX = fres1.get();
    int id1 = resUX.getValueOfId();

    s.setTitle("test2");
    
    auto fres2 = uxMapper.insertFuture(s);
    resUX = fres2.get();
    int id2 = resUX.getValueOfId();

    auto jsonMockTrainig = stringToJson(trainingData);
    REQUIRE(jsonMockTrainig != nullptr);
    auto mockTraining = *jsonMockTrainig;
    mockTraining["training"][0]["exercise"]["id"] = id1;
    mockTraining["training"][0]["exercise"]["title"] = "test1";
    mockTraining["training"][1]["exercise"]["id"] = id2;
    mockTraining["training"][1]["exercise"]["title"] = "test2";

    auto client = HttpClient::newHttpClient("http://localhost:8000");
        
    auto req = createRequest(token, "/api/v1/user-training"); 
    req->setMethod(HttpMethod::Post);
    
    req->setBody(mockTraining.toStyledString());
    
    
    client->sendRequest(req, [mockTraining, id1, id2, username, token, TEST_CTX](
        ReqResult res, const HttpResponsePtr& resp) 
    {
        REQUIRE(res == ReqResult::Ok);
        REQUIRE(resp != nullptr);

        CHECK(resp->getStatusCode() == k201Created);
        CHECK(resp->contentType() == CT_APPLICATION_JSON);
        
        std::shared_ptr<Json::Value> jresp = stringToJson(resp->getBody());
        std::string date = (*jresp)["date"].asString();

        auto client = HttpClient::newHttpClient("http://localhost:8000");    
        
        auto req = createRequest(token, "/api/v1/user-training"); 
        req->setMethod(HttpMethod::Get);
        req->setParameter("date", date);
    
        client->sendRequest(req, [mockTraining, id1, id2,  username, token, TEST_CTX](
            ReqResult res, const HttpResponsePtr& resp) 
        {
            REQUIRE(res == ReqResult::Ok);
            REQUIRE(resp != nullptr);

            CHECK(resp->getStatusCode() == k200OK);
            CHECK(resp->contentType() == CT_APPLICATION_JSON);
            
            std::shared_ptr<Json::Value> jresp = stringToJson(resp->getBody());
            
            CHECK((*jresp)["training"] == mockTraining["training"]);
            std::string date = (*jresp)["date"].asString();

            auto client = HttpClient::newHttpClient("http://localhost:8000");
            
            auto req = createRequest(token, "/api/v1/user-training");        
            req->setMethod(HttpMethod::Delete);
            req->setParameter("date", date);

            client->sendRequest(req, [id1, id2, username, token, date, TEST_CTX](
                ReqResult res, const HttpResponsePtr& resp) 
            {
                CHECK(resp->getStatusCode() == k200OK);
                
                Mapper<Workout> workoutMapper(cl);
                std::vector<Workout> w = 
                    workoutMapper.findBy(
                        Criteria(Workout::Cols::_date, CompareOperator::EQ, date));
                REQUIRE(w.empty());
                
                Mapper<UserExercise> userExMapper(cl);
                auto count = userExMapper.deleteBy(
                    Criteria(UserExercise::Cols::_id, CompareOperator::EQ, id1) 
                    || 
                    Criteria(UserExercise::Cols::_id, CompareOperator::EQ, id2)
                );
        
                REQUIRE(count == 2);
                

                Mapper<GymUser> gymUserMapper(cl);
                count = gymUserMapper.deleteBy(
                    Criteria(GymUser::Cols::_email, CompareOperator::EQ, 
                        username));
        
                REQUIRE(count == 1);
            });
        });
    });
}
