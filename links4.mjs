import {flatLinks} from "./utils/utils.mjs";

(async () => {
    const roots = [
        'bafybeibjm4zkkg2z7ll64he3k65yr3o5cotdutqf4nzkoyq2gwv7covpeu',
        'bafybeibtsurnbn3g75zv7cxjcx2c6kxdbi7xucudbylpl4apuefzyxcpuu',
        'bafybeidnxlmajqkfjpjp6lyd2py62cb4fshxebnrk73iirwepnxc647urm',
        'bafybeiemujcvn6lnqnzf5hbwx6hcd5piirdrvpsepbj5m3uowxu5l3632e',
        'bafybeihzhozmbulhnwigbrse726nzrnjotybpdqjofxcdtvq5aqpkblj5y',
        'bafybeicyfm2s3kipasrjetosanb4t7cjyky7k37ewshm27pgj5yhjprkpe',
        'bafybeidw3izg7fshxbhfdwag7lpqxdmpgcnpl4xfzmvm7q264mcwhersqi',
        'bafybeicbq3borjuykxrbq7uay7zicqi77yw3lsgihpaekbzjmatobk3ks4',
        'bafybeiesgcqppd6rjlqo7n6iom7qjwipz3jkn6c6heuhnsaqylihfo52hu',
        'bafybeicdj2lco2fd2kz4vmanqo6dtdzvyoyashfkpb4oegbzzxwqwxk6pe'
    ];
    await flatLinks(roots, 'data/upload/metadata');
})();