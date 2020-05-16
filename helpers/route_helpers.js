// route_helpers.js
// Helper functions for our nodeJS and expressJS routes.

function complete(payload) {
    payload.callbackCount++;
    if (payload.callbackCount >= payload.threads) {
        payload.res.render(payload.view, payload.context);
    }
}

exports.complete = complete;
