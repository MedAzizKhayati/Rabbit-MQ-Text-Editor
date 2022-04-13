const { channelHandler } = require("./connection");
const { readFromQueue, listenToQueue, listenOnExchange } = require("./helpers");

const SECTION_STATE_SUFFIX = "-state";
const SECTION_CONTENT_SUFFIX = "-content";
const FREE_KEYWORD = "free";

const getSectionContent = section => section + SECTION_CONTENT_SUFFIX;
const getSectionState = section => section + SECTION_STATE_SUFFIX;

const writeToSection = (message, section) => {
    if (message == undefined || message == null) {
        console.log("message is undefined.");
        return;
    }
    section = getSectionContent(section);
    channelHandler(channel => {
        channel.assertExchange(section, "fanout", {
            durable: false
        });
        channel.publish(section, "", Buffer.from(message));
    });
}

const readFromSection = (section, callback) => {
    section = getSectionContent(section);
    readFromQueue(section, callback, true);
}

const listenToSection = (section, callback) => {
    section = getSectionContent(section);
    listenOnExchange(section, callback);
}

const listenToSectionState = (section, callback) => {
    section = getSectionState(section);
    listenOnExchange(section, (msg, channel) => {
        msg != FREE_KEYWORD ? callback(msg, channel) : callback(false, channel);
    });
}

const isSectionBusy = (section, callback) => {
    section = getSectionState(section);
    readFromQueue(section, (msg, channel) => {
        msg != FREE_KEYWORD ? callback(msg, channel) : callback(false, channel);
    }, true);
}

const setSectionBusy = (section, user) => {
    section = getSectionState(section);
    channelHandler(channel => {
        channel.assertExchange(section, "fanout", {
            durable: false
        })
        channel.publish(section, "", Buffer.from(user));
    });
}

const freeSection = section => {
    section = getSectionState(section);
    channelHandler(channel => {
        channel.assertExchange(section, "fanout", {
            durable: false
        })
        channel.publish(section, "", Buffer.from(FREE_KEYWORD));
    });
}

const purgeSection = section => {
    sectionState = getSectionState(section);
    sectionContent = getSectionContent(section);
    channelHandler(channel => {
        channel.assertExchange(sectionState, "fanout", {
            durable: false
        })
        channel.assertExchange(sectionContent, "fanout", {
            durable: false
        })
        /*
        channel.assertQueue(sectionState, {
            durable: false
        })
        channel.assertQueue(sectionContent, {
            durable: false
        })
        channel.purgeQueue(sectionState);
        channel.purgeQueue(sectionContent);
        */
    })
}

module.exports = {
    writeToSection,
    readFromSection,
    listenToSection,
    isSectionBusy,
    setSectionBusy,
    freeSection,
    listenToSectionState,
    purgeSection,
}