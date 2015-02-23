require 'rails_helper'

describe ProductsController do
  render_views
  let(:valid_product) { create(:product) }

  describe "#create" do
    context 'when given all good parameters' do
      before(:each){ post :create, format: 'json', product: valid_product.attributes }
      it { expect(assigns(:product)).to be_an_instance_of(Product) }
      it { expect(response).to have_http_status :created }
    end
    context 'when given some bad parameters' do
      it { expect { post :create, format: 'json' }.to raise_error(ActionController::ParameterMissing) }
    end
  end

  describe '#show' do
    before(:each){ get :show, id: valid_product.id, format: 'json' }
    it { expect(response).to have_http_status :ok }
    it { expect(JSON.parse(response.body)).to include({
                                                          "id" => valid_product.id,
                                                          "name" => valid_product.name,
                                                          "price" => valid_product.price.to_s,
                                                          "description" => valid_product.description
                                                      }) }
  end

  describe "#update" do
    context 'when given all good parameters' do
      before(:each){
        @previous_name = valid_product.name
        post :update, id: valid_product.id, format: 'json', product: { name: 'edited_name' }
      }
      it { expect(valid_product.reload.name).to_not match(@previous_name) }
      it {expect(valid_product.reload.name).to match('edited_name') }
      it { expect(response).to have_http_status :ok }
    end
    context 'when given some bad parameters' do
      it { expect { post :update, id: valid_product.id, format: 'json' }.to raise_error(ActionController::ParameterMissing) }
    end
  end

  describe "#destroy" do
    context 'when given all good parameters' do
      before(:each){
        @new_product = create(:product)
        delete :destroy, id: @new_product.id, format: 'json'
      }
      it { expect(Product.where(id: @new_product.id)).to_not exist }
      it { expect(response).to have_http_status :no_content }
    end
    context 'when given some bad parameters' do
      let(:bad_id) { rand(10000..1000000) }
      it { expect { delete :destroy, id: bad_id, format: 'json' }.to raise_error(ActiveRecord::RecordNotFound) }
    end

  end

end