class Product < ActiveRecord::Base
  validates :name, presence: { message: "must be present." }
  validates :price, numericality: { message: "is not a number." }
  validates :description, presence: { message: "must be present." }
end
