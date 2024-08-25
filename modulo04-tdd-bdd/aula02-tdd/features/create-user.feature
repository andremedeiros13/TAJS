Feature: Create Users API
  Background:
    Given I have a running server
    Given The current date is "2023-11-23T00:00"

  Scenario: Create a new user that is 23 years old and categorize them as young-adult
    When I create a new user "young-adult" with the following details:
      | name          | birthDay   |
      | Erick Wendel  | 2000-01-01 |

    Then I request the API with the user's ID
    Then I should receive a JSON response with the user's details
    Then The user's category should be "young-adult"

  Scenario: Error when creating a user who is younger than 18 years old
    When I create a young user with the following details:
      | name  | birthDay   |
      | Alice | 2011-01-01 |
    Then I should receive an error message that the user must be at least 18 years old

  Scenario: Create an adult user
    Given I have a running server
    Given The current date is "2023-11-23T00:00"

    When I create a new user "adult" with the following details:
      | name     | birthDay   |
      | Jane     | 1980-01-01 |    
    When I request the user with ID "2"
    Then I should receive a JSON response with the user's 2 details
    And The user's 2 category should be "adult"

  Scenario: Create a senior user
    Given I have a running server
    Given The current date is "2023-11-23T00:00"

    When I create a new user "senior" with the following details 3:
      | name     | birthDay   |
      | Bob      | 1950-01-01 |    
    When I request the user with ID "3"
    Then I should receive a JSON response with the user's 3 details
    And The user's 3 category should be "senior"

  Scenario: Error when creating a user with an empty name
    Given I have a running server
    Given The current date is "2023-11-23T00:00"

    When I create a new user with the following details 4:
      | name  | birthDay   |
      |       | 1980-01-01 |
    Then I should receive an error message that the name cannot be empty

  Scenario: Error when creating a user with an invalid birth date
    Given I have a running server
    Given The current date is "2023-11-23T00:00"

    When I create a new user with the following details 5:
      | name  | birthDay   |
      | Eve   | 2090-01-01 |
    Then I should receive an error message that the birth date is invalid