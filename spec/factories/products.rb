# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :product do
    sequence(:name) { |n| "test_name_#{n}" }
    price "1.50"
    description "Test Description"
  end
end