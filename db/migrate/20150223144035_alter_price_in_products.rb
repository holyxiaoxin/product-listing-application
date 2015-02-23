class AlterPriceInProducts < ActiveRecord::Migration
  def change
    change_column :products, :price, :decimal, precision: 15, scale: 2
  end
end
