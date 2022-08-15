// axios ({
//     method: "get", // http method
//     url: "https://jsonplaceholder.typicode.com/todos/1",
//     headers: {}, // packet header
//     data: {}, // packet body 
// })
//     .then((res) => {
//         console.log(res);
//     })  // 프로미스함수 실행됐을때
//     .catch((err) => {
//         console.log(err);
//     }); // 거절됐을때 

    async function dummy() {
        try {
            const res = await axios({
                method: "get", // http method
                url: "https://jsonplaceholder.typicode.com/todos/1",
                headers: {}, // packet header
                data: {}, // packet body 
            });

            console.log(res);
        } catch (err) {
            console.error(err);
        }
    }
    dummy();