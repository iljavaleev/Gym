#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <cstdlib>
#include "utils/utils.hpp"
#include <spdlog/spdlog.h>

// void startup() __attribute__((constructor));

// void startup() 
// {
//     int result = system("../setup/db_entry.sh"); 

//     if (result == 0) 
//     {
//         std::cout << "Command executed successfully." << std::endl;
//     } 
//     else 
//     {
//         exit(1);
//     }
// }

int main() {
   
    // startup();
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
