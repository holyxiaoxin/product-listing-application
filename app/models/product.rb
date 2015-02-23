class Product < ActiveRecord::Base
  validates :name, presence: { message: "must be present." }
  validates :price, numericality: { message: "is not a positive number.", greater_than_or_equal_to: 0 }
  validates :description, presence: { message: "must be present." }
end
