require 'rails_helper'

describe Product do

  it "has a valid factory" do
    expect(build(:product)).to be_valid
  end

  let(:product) { build(:product) }

  describe "ActiveModel validations" do
    # Basic validations (using Shoulda)
    it {
      expect(product).to validate_presence_of(:name).with_message(/must be present./)
      expect(product).to validate_numericality_of(:price).is_greater_than_or_equal_to(0).with_message(/is not a positive number./)
      expect(product).to validate_presence_of(:description).with_message(/must be present./)
    }
  end

end