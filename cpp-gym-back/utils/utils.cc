#include "utils.hpp"
#include "bcrypt.h"
#include "models/GymUser.h"
#include <memory>
#include <jwt-cpp/jwt.h>

using drogon_model::cpp_gymdb::GymUser;
using drogon::orm::Criteria;
using drogon::orm::CompareOperator;
using drogon::orm::Mapper;


bool validateEmail(std::string_view email)
{
   const std::regex pattern("(\\w+)(\\.|_)?(\\w*)@(\\w+)(\\.(\\w+))+");
   return std::regex_match(email, pattern);
}

bool verifyPassword(std::string_view password, std::string_view hash)
{
    return bcrypt::validatePassword(password, hash);
}

std::string_view getPasswordHash(std::string_view password)
{
    return bcrypt::generateHash(password);
}

std::shared_ptr<GymUser> addUser(std::string_view email, 
    std::string_view password, drogon::orm::DbClientPtr clientPtr)
{
    std::string hashedPassword = bcrypt::generateHash(password);
  
    Mapper<GymUser> mp(clientPtr);
    auto res_future = mp.insertFuture(std::move(user));
    try
    {
        return std::make_shared<GymUser>(res_future.get());
    }
    catch(const std::exception& e)
    {
        LOGGER->error(e.what());
        return nullptr;
    }

    return nullptr;
}
    

std::shared_ptr<GymUser> getUser(std::string_view email, 
    drogon::orm::DbClientPtr clientPtr)
{
    
    if (not validateEmail(email))
        return nullptr;
    Mapper<GymUser> mp(clientPtr);
    try
    {
        auto res_future = mp.findFutureOne(Criteria(GymUser::Cols::_email, 
            CompareOperator::EQ, email));
        return std::make_shared<GymUser>(res_future.get());
    }
    catch(const std::exception& e)
    {
        LOGGER->error(e.what());
        return nullptr;
    }
    
    return nullptr;
}
   
std::shared_ptr<GymUser> authenticateUser(std::string_view email, 
    std::string_view password, drogon::orm::DbClientPtr)
{
    if (not verifyPassword(password, user.hashed_password))
        return nullptr;
    auto future_res = std::async(&getUser, email, password);
    try
    {
        return future_res.get();
    }
    catch(const std::exception& e)
    {
        LOGGER->error(e.what());
        return nullptr;
    }
    
    return nullptr;
}

std::string createAccessToken(Json::Value& data)
{
    using namespace std::chrono;
    auto exp = std::chrono::seconds{ACCESS_TOKEN_EXPIRE_MINUTES * 60};
    auto token = jwt::create()
                .set_type("JWS")
                .set_issuer("auth0")
                .set_expires_in(exp);

    for (const auto& elem: data.getMemberNames())
    {
        token = token.set_payload_claim(elem, 
            jwt::claim(data[elem].asString())); 
    }

    token = token.set_payload_claim("exp", jwt::claim(exp)); 
    return token.sign(jwt::algorithm::hs256{SECRET_KEY});
}

std::string decodeAccesToken(
    const std::string& token, 
    const std::string& secret, 
    drogon::orm::DbClientPtr clientPtr)
{

    auto verifier = jwt::verify()
						.allow_algorithm(jwt::algorithm::hs256{secret})
						.with_issuer("auth0");
    auto decoded = jwt::decode(token);

	try 
    {
		verifier.verify(decoded);
	} 
    catch (const std::exception& ex) 
    { 
        LOGGER->error("Varification failed");
        return {};
    }
    auto pl = decoded.get_payload_json();
    if (!pl.contains("email"))
    {
        return {};
    }

    return pl.at("email").get<std::string>();
}
