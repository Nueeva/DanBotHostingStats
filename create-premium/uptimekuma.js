createListPrem.uptimekuma = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 19,
    egg: 70,
    docker_image: "ghcr.io/parkervcp/apps:uptimekuma",
    startup:
        'node /home/container/server/server.js --port={{SERVER_PORT}}',
    limits: {
        memory: 0,
        swap: -1,
        disk: 0,
        io: 500,
        cpu: 0,
    },
    environment: {
        JS_FILE: "server/server.js"
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10,
    },
    deploy: {
        locations: botswebdbPREM,
        dedicated_ip: false,
        port_range: [],
    },
    start_on_completion: false,
});
