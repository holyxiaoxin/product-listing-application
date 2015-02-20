$(function() {
    $('#save-new-product-button').on('click', function () {
        var name = $('#product-name').val();
        var price = $('#product-price').val();
        var description = $('#product-description').val();

        var product = {};
        product['name'] = name;
        product['price'] = price;
        product['description'] = description;

        $.post("/products.json", { product: { name: name, price: price, description: description } })
            .done(function( data ) {
                // Close modal and update container
                $('#newProductModal').modal('hide').find('form')[0].reset();
                // TODO: update container
                var clone = $('#item-template').children().clone();
                clone.attr('data-id', data['id']);
                clone.find('.product-name').html(data['name']);
                clone.find('.product-price').html("$"+data['price']);
                $('#product-listing').prepend(clone);
            })
            .fail(function(data) {
                // Parse errors into alert div
                var errors = data['responseJSON']['error'];
                var errorMessage = errors.length+" error";
                if(errors.length>1){ errorMessage += "s"; }
                errorMessage += " prohibited this product from being saved: "+"<ul>";
                for(var i=0;i<errors.length;i++){
                    errorMessage += "<li>"+errors[i]+"</li>";
                }
                errorMessage += "</ul>";
                $('#new-product-errors').html(errorMessage).addClass('alert').addClass('alert-danger');
            })
            .always(function(data){
                console.log(JSON.stringify(data));
                $('#new-product-button').blur();
            }, 'json');
    });

    var bodyContainer = $('body');
    // Show
    bodyContainer.on('click', '.product-item', function(){
        var productId = $(this).data('id');
        $.get("/products/"+productId+".json")
            .done(function(data){
                cloneToContentTemplate(data);

            })
            .fail(function(data){
                alert(JSON.stringify(data));
            }, 'json');
    });
    // Edit
    bodyContainer.on('click', '.edit-product-button', function() {
        var productId = $(this).parents('.product-content').data('id');
        $.get("/products/"+productId+".json")
            .done(function(data){
                $modalContainer = $('#editProductModal');
                $modalContainer.find('#product-name').val(data['name']);
                $modalContainer.find('#product-price').val(data['price']);
                $modalContainer.find('#product-description').val(data['description']);
                $('#edit-existing-product-button').attr('data-id',data['id']);
                $modalContainer.modal('show');
            })
            .fail(function(data){
                alert(JSON.stringify(data));
            }, 'json');
    });
    $('#edit-existing-product-button').on('click', function() {
        var productId = $(this).data('id');
        var $modalContentContainer = $(this).parents('.modal-content');
        console.log($modalContentContainer);
        var product = {};
        product['name'] = $modalContentContainer.find('#product-name').val();
        product['price'] = $modalContentContainer.find('#product-price').val();
        product['description'] = $modalContentContainer.find('#product-description').val();
        console.log(productId);
        $.ajax({
            url: "/products/"+productId+".json",
            type: "PUT",
            data: { product: product }
        })
            .done(function(data){
                cloneToContentTemplate(data);
                $('#editProductModal').modal('hide');
            })
            .fail(function(data){
                console.log(JSON.stringify(data));
                // Parse errors into alert div
                var errors = data['responseJSON']['error'];
                var errorMessage = errors.length+" error";
                if(errors.length>1){ errorMessage += "s"; }
                errorMessage += " prohibited this product from being saved: "+"<ul>";
                for(var i=0;i<errors.length;i++){
                    errorMessage += "<li>"+errors[i]+"</li>";
                }
                errorMessage += "</ul>";
                $('#edit-product-errors').html(errorMessage).addClass('alert').addClass('alert-danger');
            }, 'json');

    });
    // Delete
    bodyContainer.on('click', '.delete-product-button', function(){
        var c = confirm("Are you sure you want to delete this product?");
        if(c){
            var productId = $(this).parents('.product-content').data('id');
            $.ajax({
                url: "/products/"+productId+".json",
                type: "DELETE"
            })
                .done(function(){
                    window.location.href = "/";
                }, 'json');
        }else{
            $(this).blur();
        }
    });

    // Clear errors while closing dialog
    $('#editProductModal').on('hidden.bs.modal', function (event) {
        $('.errors-alert').html("").removeClass('alert').removeClass('alert-danger');
    });
});

function cloneToContentTemplate(data){
    var clone = $('#content-template').children().clone();
    clone.attr('data-id', data['id']);
    clone.find('.product-name').html(data['name']);
    clone.find('.product-price').html(data['price']);
    clone.find('.product-description').html(data['description']);
    $('#page-content-wrapper').html(clone);
}



