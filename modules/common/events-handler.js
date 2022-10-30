const EventsHandler = {
    click(element, callback) {
        this.handleEvent(element, callback, "click");
    },

    change(element, callback) {
        this.handleEvent(element, callback, "change");
    },

    handleEvent(element, callback, type) {
        if (Array.isArray(element)) {
            element.forEach(x => x.addEventListener(type, () => {
                callback(x);
            }));
        }
        else {
            element.addEventListener(type, (e) => {
                callback(e)
            });
        }
    }
};

export {
    EventsHandler
};