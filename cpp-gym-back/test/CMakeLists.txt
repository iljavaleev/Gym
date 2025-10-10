cmake_minimum_required(VERSION 3.10)
project(cpp-gym-back_test CXX)

aux_source_directory(${CMAKE_SOURCE_DIR}/models MODEL_SUB_SRC)
aux_source_directory(${CMAKE_SOURCE_DIR}/utils UTILS_SUB_SRC)

find_package(spdlog CONFIG REQUIRED)
set(THIRD_PARTY_LIB_INCLUDE_DIR ${CMAKE_SOURCE_DIR}/third_party_lib/Bcrypt.cpp/include)

add_executable(${PROJECT_NAME} test_main.cc)
target_link_libraries(${PROJECT_NAME} PRIVATE Drogon::Drogon spdlog::spdlog bcrypt)
# ##############################################################################

#message("The value of CMAKE_SOURCE_DIR is: ${CMAKE_SOURCE_DIR}/models")
target_include_directories(${PROJECT_NAME}
                           PRIVATE ${CMAKE_SOURCE_DIR}
                                   ${CMAKE_SOURCE_DIR}/models
                                   ${CMAKE_SOURCE_DIR}/utils
                                   ${THIRD_PARTY_LIB_INCLUDE_DIR})

target_sources(${PROJECT_NAME}
               PRIVATE
               ${MODEL_SUB_SRC}
               ${UTILS_SUB_SRC})

ParseAndAddDrogonTests(${PROJECT_NAME})
