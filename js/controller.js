function Controller() {
    this.api = '';

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

    this.setAPI = (api) => {
        var mapTypes = {
            'Product' : 'Produtos',
            'Pricebook' : 'Listas de Preço',
            'PricebookEntry' : 'Entrada de Preço',
        };

        $('#selected_type').html(mapTypes[api]);
        this.api = api;
        this.select(api);
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
    }

    this.getHeader_Product = () => {
        return `
            <th>Código</th>
            <th>Nome</th>
            <th>Descrição</th>
        `;
    }

    this.getHeader_Pricebook = () => {
        return `
            <th>Código</th>
            <th>Nome</th>
            <th>Descrição</th>`
        ;
    }

    this.getHeader_PricebookEntry = () => {
        return `
            <th>Produto</th>
            <th>Lista de Preço</th>
            <th>Preço</th>`
        ;
    }

    this.getBody_Product = (records) => {
        var html = '';

        records.forEach((item) => {
            html += `
                <tr>
                    <td> ${item.code} </td>
                    <td> ${item.name} </td>
                    <td> ${item.desc} </td>
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
                </tr>
            `;
        })

        return html;
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
                        <a style="margin-left: 10px;" class="waves-effect waves-light btn red darken-3"> Cadastrar </a>
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
                        <a style="margin-left: 10px;" class="waves-effect waves-light btn red darken-3"> Cadastrar </a>
                    </div>
                </form>
            </div>
        `;
    }

    this.getInsertTemplate_PricebookEntry = () => {
        return `
            <div class="row">
                <form class="col s12">
                    <div class="row">
                        <div class="input-field col s6">
                            <input id="last_name" type="text">
                            <label for="last_name">Nome do Produto</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s6">
                            <input id="last_name" type="text">
                            <label for="last_name">Descrição do Produto</label>
                        </div>
                    </div>
                    <div class="row">
                        <a style="margin-left: 10px;" class="waves-effect waves-light btn red darken-3"> Cadastrar </a>
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
Controller.setAPI = (api) => {
    Controller.getInstance().setAPI(api);
}
Controller.buildInsertTemplate = (api) => {
    Controller.getInstance().buildInsertTemplate(api);
}