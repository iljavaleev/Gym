#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <cstdlib>
#include "utils/utils.hpp"
#include <spdlog/spdlog.h>

int main() {
    //Set HTTP listener address and port
    spdlog::set_default_logger(LOGGER);
    spdlog::default_logger()->set_level(spdlog::level::err);
    spdlog::default_logger()->flush_on(spdlog::level::err);

    drogon::app().addListener("0.0.0.0", 5555);
    //Load config file
    drogon::app().loadConfigFile("../config.json");
    //drogon::app().loadConfigFile("../config.yaml");
    //Run HTTP framework,the method will block in the internal event loop
    drogon::app().run();
    return 0;
}
