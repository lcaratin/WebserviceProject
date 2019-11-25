function Controller() {
    this.api = '';

    this.products = [];
    this.pricebooks = [];

    this.pricebookEntryBase = () => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                debugger;
                console.log(xhttp.responseText);
                Controller.getInstance().products = JSON.parse(xhttp.responseText);

                var xhttpPricebook = new XMLHttpRequest();
                xhttpPricebook.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(xhttpPricebook.responseText);
                        Controller.getInstance().pricebooks = JSON.parse(xhttpPricebook.responseText);
                        Controller.buildInsertTemplate('PricebookEntry');
        
                    }
                };
                xhttpPricebook.open("GET", `http://localhost:8080/WebserviceProject/PricebookAPI`, true);
                xhttpPricebook.send();

            }
        };
        xhttp.open("GET", `http://localhost:8080/WebserviceProject/ProductAPI`, true);
        xhttp.send();
    }

    this.callWebservice = (api, callback) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(xhttp.responseText);
                Controller.buildTable(api, JSON.parse(xhttp.responseText));
            }
        };
        xhttp.open("GET", `http://localhost:8080/WebserviceProject/${api}API`, true);
        xhttp.send();
    }

    this.callPostWebservice = (api, parameters) => {
        var selectedAPI = api ? api : this.api;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(xhttp.responseText);
                Controller.buildTable(selectedAPI, JSON.parse(xhttp.responseText));
                Controller.clearFields();
            }
        };
        var urlParameters = Controller.buildURLParameters(parameters);
        xhttp.open("POST", `http://localhost:8080/WebserviceProject/${selectedAPI}API?${urlParameters}`, true);
        xhttp.send();
    }

    this.callDeleteWebservice = (api, recordCode) => {
        var selectedAPI = api ? api : this.api;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(xhttp.responseText);
                Controller.buildTable(selectedAPI, JSON.parse(xhttp.responseText));
            }
        };

        xhttp.open("DELETE", `http://localhost:8080/WebserviceProject/${selectedAPI}API?code=${recordCode}`, true);
        xhttp.send();
    }

    this.clearFields = () => {
        $('#p_name').val('');
        $('#p_desc').val('');
        $('#p_price').val('');
    }

    this.buildURLParameters = (record) => {
        var urlPart = '';

        Object.keys(record).forEach((key) => {
            urlPart += `${key}=${record[key]}&`;
        });

        return urlPart;
    }

    this.setAPI = (api) => {
        var mapTypes = {
            'Product' : 'Produtos',
            'Pricebook' : 'Listas de Preço',
            'PricebookEntry' : 'Entrada de Preço',
        };

        $('#selected_type').html(mapTypes[api]);
        this.api = api;
        this.select(api);

        if (this.api == 'PricebookEntry')
            this.pricebookEntryBase();
        else this.buildInsertTemplate();
    }

    this.select = (api) => {
        var selectedAPI = api ? api : this.api;
        this.callWebservice(selectedAPI);
    }

    this.buildTable = (api, records) => {
        var header = this[`getHeader_${api}`](),
            body = this[`getBody_${api}`](records);

        var html = `
            <table>
                <thead>
                    <tr>
                    ${header}
                    <tr>
                </thead>
                <tbody>
                ${body}
                </tbody>
            </table>
        `;

        $('#content_1').html(html);
    }

    this.buildInsertTemplate = (api) => {
        var selectedAPI = api ? api : this.api;
        var template = this[`getInsertTemplate_${selectedAPI}`];
        
        $('#content_2').html(template);

        $(document).ready(function(){
            $('select').formSelect();
        });
    }

    this.getHeader_Product = () => {
        return `
            <th>Código</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ação</th>
        `;
    }

    this.getHeader_Pricebook = () => {
        return `
            <th>Código</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ação</th>
        `;
    }

    this.getHeader_PricebookEntry = () => {
        return `
            <th>Produto</th>
            <th>Lista de Preço</th>
            <th>Preço</th>
            <th>Ação</th>
        `;
    }

    this.getBody_Product = (records) => {
        var html = '';

        records.forEach((item) => {
            html += `
                <tr>
                    <td> ${item.code} </td>
                    <td> ${item.name} </td>
                    <td> ${item.desc} </td>
                    <td> <a onclick="Controller.delete('${item.code}')" class="waves-effect waves-light btn red darken-3"> Excluir </a> </td>
                </tr>
            `;
        })

        return html;
    }

    this.getBody_Pricebook = (records) => {
        var html = '';

        records.forEach((item) => {
            html += `
                <tr>
                    <td> ${item.code} </td>
                    <td> ${item.name} </td>
                    <td> ${item.desc} </td>
                    <td> <a onclick="Controller.delete('${item.code}')" class="waves-effect waves-light btn red darken-3"> Excluir </a> </td>
                </tr>
            `;
        })

        return html;
    }

    this.getBody_PricebookEntry = (records) => {
        var html = '';

        records.forEach((item) => {
            html += `
                <tr>
                    <td> ${item.product.name} </td>
                    <td> ${item.pricebook.name} </td>
                    <td> ${item.price} </td>
                    <td> <a onclick="Controller.delete('${item.code}')" class="waves-effect waves-light btn red darken-3"> Excluir </a> </td> 
                </tr>
            `;
        })

        return html;
    }

    this.delete = (recordCode, api) => {
        debugger;
        var selectedAPI = api ? api : this.api;

        this.callDeleteWebservice(
            selectedAPI, 
            recordCode
        );
    }

    this.insert = (api) => {
        debugger;
        var selectedAPI = api ? api : this.api;
        var record = this[`getRecord_${selectedAPI}`]();

        this.callPostWebservice(selectedAPI, record);
    }

    this.getRecord_Product = () => {
        var product = {
            'name' : $('#p_name').val(),
            'desc' : $('#p_desc').val(),
        };

        return product;
    }

    this.getRecord_Pricebook = () => {
        var pricebook = {
            'name' : $('#p_name').val(),
            'desc' : $('#p_desc').val(),
        };

        return pricebook;
    }

    this.getRecord_PricebookEntry = () => {
        var pricebookEntry = {
            'product': $('#p_product').val(),
            'pricebook': $('#p_product').val(),
            'price': $('#p_price').val(),
        };

        return pricebookEntry;
    }

    this.getInsertTemplate_Product = () => {
        return `
            <div class="row">
                <form class="col s12">
                    <div class="row">
                        <div class="input-field col s6">
                            <input id="p_name" type="text">
                            <label for="p_name">Nome do Produto</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s6">
                            <input id="p_desc" type="text">
                            <label for="p_desc">Descrição do Produto</label>
                        </div>
                    </div>
                    <div class="row">
                        <a onclick="Controller.insert()" style="margin-left: 10px;" class="waves-effect waves-light btn red darken-3"> Cadastrar </a>
                    </div>
                </form>
            </div>
        `;
    }

    this.getInsertTemplate_Pricebook = () => {
        return `
            <div class="row">
                <form class="col s12">
                    <div class="row">
                        <div class="input-field col s6">
                            <input id="p_name" type="text">
                            <label for="p_name">Nome da Lista de Preço</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s6">
                            <input id="p_desc" type="text">
                            <label for="p_desc">Descrição da Lista de Preço</label>
                        </div>
                    </div>
                    <div class="row">
                        <a onclick="Controller.insert()" style="margin-left: 10px;" class="waves-effect waves-light btn red darken-3"> Cadastrar </a>
                    </div>
                </form>
            </div>
        `;
    }

    this.getInsertTemplate_PricebookEntry = () => {
        var productOptions = '';
        this.products.forEach((item) => {
            productOptions += `
                <option value="${item.code}"> ${item.name} </option>
            `;
        });

        var pricebookOptions = '';
        this.pricebooks.forEach((item) => {
            pricebookOptions += `
                <option value="${item.code}"> ${item.name} </option>
            `;
        });
        
        return `
            <div class="row">
                <form class="col s12">
                    <div class="row">
                        <div class="input-field col s6">
                            <select id="p_product">
                                <option value="" disabled selected> Selecione um Produto </option>
                                ${productOptions}
                            </select>
                            <label> Produto </label>
                        </div>

                    </div>

                    <div class="row">
                        <div class="input-field col s6">
                            <select id="p_pricebook">
                                <option value="" disabled selected> Selecione uma Lista de Preço </option>
                                ${pricebookOptions}
                            </select>
                            <label>Lista de Preço </label>
                        </div>
                    </div>

                    <div class="row">
                        <div class="input-field col s6">
                            <input id="p_price" type="number">
                            <label for="p_price">Valor do produto</label>
                        </div>
                    </div>
                    <div class="row">
                        <a onclick="Controller.insert()" style="margin-left: 10px;" class="waves-effect waves-light btn red darken-3"> Cadastrar </a>
                    </div>
                </form>
            </div>
        `;
    }
    
}

Controller.instance = null;

Controller.getInstance = () => {
    if (Controller.instance == null)
    Controller.instance = new Controller();
    return Controller.instance;
}

Controller.buildTable = (api, records) => {
    Controller.getInstance().buildTable(api, records);
}
Controller.select = (api) => {
    Controller.getInstance().select(api);
}
Controller.insert = (api) => {
    Controller.getInstance().insert(api);
}
Controller.delete = (api) => {
    Controller.getInstance().delete(api);
}
Controller.setAPI = (api) => {
    Controller.getInstance().setAPI(api);
}
Controller.buildInsertTemplate = (api) => {
    Controller.getInstance().buildInsertTemplate(api);
}
Controller.buildURLParameters = (record) => {
    return Controller.getInstance().buildURLParameters(record);
}
Controller.clearFields = () => {
    Controller.getInstance().clearFields();
}