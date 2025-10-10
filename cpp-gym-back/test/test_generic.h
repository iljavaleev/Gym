#pragma once

#include <drogon/drogon_test.h>
#include <drogon/drogon.h>

#include "models/Strength.h"
#include "models/Endurance.h"
#include "test_auth.h"


using drogon_model::cpp_gymdb::Strength;
using drogon_model::cpp_gymdb::Endurance;
using drogon::orm::Criteria;
using drogon::orm::CompareOperator;
using drogon::orm::Mapper;
using drogon::orm::DbClient;

using namespace  drogon;


DROGON_TEST(GenericTest)
{
    // add test data tp strength table
    Json::Value js;
    js["id"] = 1;
    js["exercise"] = "test strength";
    js["reps"] = 10;
    js["work_id"] = 777;
    js["week_id"] = 1;
    
    Strength s(js);
    Mapper<Strength> strengthMapper(cl);
    strengthMapper.insert(s);
    
    // add test data tp endurance table
    Json::Value je = js;
    je["exercise"] = "test endurance";
    je["superset"] = 1;
    
    Endurance e(je);
    Mapper<Endurance> enduranceMapper(cl);
    enduranceMapper.insert(e);

    auto client = HttpClient::newHttpClient("http://localhost:8000");
    auto req = HttpRequest::newHttpRequest();
    
    req->setMethod(HttpMethod::Get);
    req->setPath("/api/v1/search");
    req->setParameter("book", "0");
    req->setParameter("number", "777");

    client->sendRequest(req, [TEST_CTX](
        ReqResult res, const HttpResponsePtr& resp) 
    {
        REQUIRE(res == ReqResult::Ok);
        REQUIRE(resp != nullptr);

        CHECK(resp->getStatusCode() == k200OK);
        CHECK(resp->contentType() == CT_APPLICATION_JSON);
        
        std::shared_ptr<Json::Value> jresp = stringToJson(resp->getBody());
        REQUIRE(jresp->isArray());
        REQUIRE(jresp->size() == 1);
        REQUIRE((*jresp)[0]["exercise"] == "test strength");
        REQUIRE((*jresp)[0]["reps"] == "10");

        Mapper<Strength> strengthMapper(cl);
        auto count = strengthMapper.deleteBy(
            Criteria(Strength::Cols::_work_id, CompareOperator::EQ, 777));

        REQUIRE(count == 1);
        
    });

    auto eReq = HttpRequest::newHttpRequest();
    eReq->setMethod(HttpMethod::Get);
    eReq->setPath("/api/v1/search");
    eReq->setParameter("book", "1");
    eReq->setParameter("number", "777");

    client->sendRequest(eReq, [TEST_CTX](
        ReqResult res, const HttpResponsePtr& resp) 
    {
        REQUIRE(res == ReqResult::Ok);
        REQUIRE(resp != nullptr);

        CHECK(resp->getStatusCode() == k200OK);
        CHECK(resp->contentType() == CT_APPLICATION_JSON);
        
        std::shared_ptr<Json::Value> jresp = stringToJson(resp->getBody());
        REQUIRE(jresp->isArray());
        REQUIRE(jresp->size() == 1);
        REQUIRE((*jresp)[0]["exercise"] == "test endurance");
        REQUIRE((*jresp)[0]["reps"] == "10");
        REQUIRE((*jresp)[0]["superset"] == 1);
        
         Mapper<Endurance> enduranceMapper(cl);
        auto count = enduranceMapper.deleteBy(
            Criteria(Endurance::Cols::_work_id, CompareOperator::EQ, 777));

        REQUIRE(count == 1);
    });
}
