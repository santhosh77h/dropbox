import FileSaver from 'file-saver';


class ApiRequest {
    
    login(data){
        return new Promise((resolve,reject) => {
            let obj = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    data: data
                })
            };
            console.log(obj)
            fetch('login', obj)
                .then(function (response) {
                    setTimeout(() => null, 5); // this  is the workaround data not loading fast enough
                    response.json().then(function (data) {
                        resolve(data)
                    });
                })
                .catch((error) => {
                    console.log('there is an error in request', error);
                    reject(error);
                })
        })
    }
    
    addUserInterest(data){
        return new Promise((resolve,reject) => {
            let obj = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    data: data
                })
            };
            console.log(obj)
            fetch('addUserInterest', obj)
                .then(function (response) {
                    setTimeout(() => null, 5); // this  is the workaround data not loading fast enough
                    response.json().then(function (data) {
                        resolve(data)
                    });
                })
                .catch((error) => {
                    console.log('there is an error in request', error);
                    reject(error);
                })
        })
    }

    signup(data){
        return new Promise((resolve,reject) => {
            let obj = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    data: data
                })
            };
            console.log(obj)
            fetch('signup', obj)
                .then(function (response) {
                    setTimeout(() => null, 5); // this  is the workaround data not loading fast enough
                    response.json().then(function (data) {
                        resolve(data)
                    });
                })
                .catch((error) => {
                    console.log('there is an error in request', error);
                    reject(error);
                })
        })
    }


    getAllTheUserList(data){
        return new Promise((resolve,reject) => {
            let obj = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    data: data
                })
            };
            console.log(obj)
            fetch('getAllTheUserList', obj)
                .then(function (response) {
                    setTimeout(() => null, 5); // this  is the workaround data not loading fast enough
                    response.json().then(function (data) {
                        resolve(data)
                    });
                })
                .catch((error) => {
                    console.log('there is an error in request', error);
                    reject(error);
                })
        })
    }

    shareFolder (data){
        return new Promise((resolve,reject) => {
            let obj = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    data: data
                })
            };
            console.log(obj)
            fetch('shareFolder/email', obj)
                .then(function (response) {
                    setTimeout(() => null, 5); // this  is the workaround data not loading fast enough
                    response.json().then(function (data) {
                        resolve(data)
                    });
                })
                .catch((error) => {
                    console.log('there is an error in request', error);
                    reject(error);
                })
        })
    }

    authenticate(data){
        return new Promise((resolve,reject) => {
            let obj = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    data: data
                })
            };
            console.log(obj)
            fetch('authenticate', obj)
                .then(function (response) {
                    setTimeout(() => null, 5); // this  is the workaround data not loading fast enough
                    response.json().then(function (data) {
                        resolve(data)
                    });
                })
                .catch((error) => {
                    console.log('there is an error in request', error);
                    reject(error);
                })
        })
    }


    createFolder(data){
        return new Promise((resolve,reject) => {
            let obj = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(data)
            };
            console.log(obj)
            fetch('folders/'+data.folderId, obj)
                .then(function (response) {
                    setTimeout(() => null, 5); // this  is the workaround data not loading fast enough
                    response.json().then(function (data) {
                        resolve(data)
                    });
                })
                .catch((error) => {
                    console.log('there is an error in request', error);
                    reject(error);
                })
        })
    }

    openNextFolder(data){
        return new Promise((resolve,reject) => {
            /*let obj = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            };*/
            fetch('folders/'+data)
                .then(function (response) {
                    setTimeout(() => null, 5); // this  is the workaround data not loading fast enough
                    response.json().then(function (data) {
                        resolve(data)
                    });
                })
                .catch((error) => {
                    console.log('there is an error in request', error);
                    reject(error);
                })
        })
    }

    downloadFile(fileId,folderId,fileName){
        return new Promise((resolve,reject) => {
            let obj = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            };
            fetch('fileInFolder/'+folderId+'/'+fileId,obj)
                .then(function (response) {
                    setTimeout(() => null, 5); // this  is the workaround data not loading fast enough
                    response.blob().then(function (data) {
                        console.log(data)
                        //resolve(data)
                        FileSaver.saveAs(data, fileName);
                    });
                    //resolve()
                })
                .catch((error) => {
                    console.log('there is an error in request', error);
                    reject(error);
                })
        })
    }


    uploadFile(data,folderId){
        console.log(data,folderId)
        return new Promise((resolve,reject) => {
            let obj = {
                method: 'PUT',
                body: data
            };
            console.log(obj)
            fetch('fileInFolder/'+folderId, obj)
                .then(function (response) {
                    setTimeout(() => null, 5); // this  is the workaround data not loading fast enough
                    response.json().then(function (data) {
                        resolve(data)
                    });
                })
                .catch((error) => {
                    console.log('there is an error in request', error);
                    reject(error);
                })
        })
    }

}

export default new ApiRequest()