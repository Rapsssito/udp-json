const rewire = require("rewire")
const index = rewire("./index")
const PendingDatagram = index.__get__("PendingDatagram")

// @ponicode
describe("addPayload", () => {
    let inst

    beforeEach(() => {
        inst = new PendingDatagram({ timeout: 1000, datagramCount: 0.5 }, "Jean-Philippe", () => "return callback value", () => 0.05, () => "return callback value")
    })

    test("0", () => {
        let callFunction = () => {
            inst.addPayload(-29.45, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst.addPayload(10.0, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst.addPayload(1.0, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst.addPayload(-0.5, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst.addPayload(-1.0, "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst.addPayload(NaN, "")
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("stopTimeout", () => {
    let inst

    beforeEach(() => {
        inst = new PendingDatagram({ timeout: 0.0005, datagramCount: 0.0 }, "George", () => "return callback value", () => 1000, () => "return callback value")
    })

    test("0", () => {
        let callFunction = () => {
            inst.stopTimeout()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("startTimeout", () => {
    let inst

    beforeEach(() => {
        inst = new PendingDatagram({ timeout: 1000000.0, datagramCount: -1.0 }, "Pierre Edouard", () => "return callback value", () => 5.0, () => "return callback value")
    })

    test("0", () => {
        let callFunction = () => {
            inst.startTimeout()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("resetTimeout", () => {
    let inst

    beforeEach(() => {
        inst = new PendingDatagram({ timeout: 0.05, datagramCount: 10.23 }, "Michael", () => "return callback value", () => 15, () => "return callback value")
    })

    test("0", () => {
        let callFunction = () => {
            inst.resetTimeout()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("isComplete", () => {
    let inst

    beforeEach(() => {
        inst = new PendingDatagram({ timeout: 60, datagramCount: 10.0 }, "Anas", () => "return callback value", () => 16, () => "return callback value")
    })

    test("0", () => {
        let callFunction = () => {
            inst.isComplete()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("getPayload", () => {
    let inst

    beforeEach(() => {
        inst = new PendingDatagram({ timeout: 15, datagramCount: 1.0 }, "Edmond", () => "return callback value", () => 15, () => "return callback value")
    })

    test("0", () => {
        let callFunction = () => {
            inst.getPayload()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_buildHeader", () => {
    let inst

    beforeEach(() => {
        inst = new index()
    })

    test("0", () => {
        let callFunction = () => {
            inst._buildHeader(12345, 10.0, 1.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst._buildHeader(56784, 10.0, 0.5)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst._buildHeader("bc23a9d531064583ace8f67dad60f6bb", -0.5, -1.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst._buildHeader(12345, -0.5, -29.45)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst._buildHeader(987650, 0.0, -29.45)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst._buildHeader(undefined, -Infinity, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_loadListeners", () => {
    let inst

    beforeEach(() => {
        inst = new index()
    })

    test("0", () => {
        let callFunction = () => {
            inst._loadListeners()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_onMessage", () => {
    let inst

    beforeEach(() => {
        inst = new index()
    })

    test("0", () => {
        let callFunction = () => {
            inst._onMessage("Message originator is not the grader, or the person being graded", "Pierre Edouard")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst._onMessage("the specified credentials were rejected by the server", "Anas")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst._onMessage("To force deletion of the LAG use delete_force: True", "Anas")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst._onMessage("Empty name specified", "Jean-Philippe")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst._onMessage("Unable to allocate address", "Jean-Philippe")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst._onMessage(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_onDatagramError", () => {
    let inst

    beforeEach(() => {
        inst = new index()
    })

    test("0", () => {
        let callFunction = () => {
            inst._onDatagramError("7289708e-b17a-477c-8a77-9ab575c4b4d8", "Anas", "George", "error")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst._onDatagramError("03ea49f8-1d96-4cd0-b279-0684e3eec3a9", "George", "Jean-Philippe", "ValueError")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst._onDatagramError("7289708e-b17a-477c-8a77-9ab575c4b4d8", "Michael", "Edmond", "error")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst._onDatagramError("a85a8e6b-348b-4011-a1ec-1e78e9620782", "George", "Anas", "error")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst._onDatagramError("a85a8e6b-348b-4011-a1ec-1e78e9620782", "Pierre Edouard", "Jean-Philippe", "invalid choice")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst._onDatagramError(undefined, undefined, undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_onDatagramTimeout", () => {
    let inst

    beforeEach(() => {
        inst = new index()
    })

    test("0", () => {
        let callFunction = () => {
            inst._onDatagramTimeout("a85a8e6b-348b-4011-a1ec-1e78e9620782", "Jean-Philippe", "Michael", "error")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst._onDatagramTimeout("a85a8e6b-348b-4011-a1ec-1e78e9620782", "George", "Pierre Edouard", "too many arguments")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst._onDatagramTimeout("03ea49f8-1d96-4cd0-b279-0684e3eec3a9", "Anas", "Anas", "ValueError")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst._onDatagramTimeout("a85a8e6b-348b-4011-a1ec-1e78e9620782", "Jean-Philippe", "Pierre Edouard", "Message box: foo; bar\n")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst._onDatagramTimeout("7289708e-b17a-477c-8a77-9ab575c4b4d8", "Pierre Edouard", "Anas", "Message box: foo; bar\n")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst._onDatagramTimeout(undefined, "", undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_onDatagramComplete", () => {
    let inst

    beforeEach(() => {
        inst = new index()
    })

    test("0", () => {
        let callFunction = () => {
            inst._onDatagramComplete("03ea49f8-1d96-4cd0-b279-0684e3eec3a9", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "Michael")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst._onDatagramComplete("7289708e-b17a-477c-8a77-9ab575c4b4d8", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "Jean-Philippe")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst._onDatagramComplete("03ea49f8-1d96-4cd0-b279-0684e3eec3a9", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "Jean-Philippe")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst._onDatagramComplete("03ea49f8-1d96-4cd0-b279-0684e3eec3a9", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "Edmond")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst._onDatagramComplete("a85a8e6b-348b-4011-a1ec-1e78e9620782", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E", "Anas")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst._onDatagramComplete(undefined, undefined, "")
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_unwrapMessage", () => {
    let inst

    beforeEach(() => {
        inst = new index()
    })

    test("0", () => {
        let callFunction = () => {
            inst._unwrapMessage({ readInt32BE: () => -5.48, toString: () => "2019-07-01" }, "Jean-Philippe")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst._unwrapMessage({ readInt32BE: () => -5.48, toString: () => "2019-07-01" }, "Edmond")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst._unwrapMessage({ readInt32BE: () => -5.48, toString: () => "2017-03-01" }, "Jean-Philippe")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst._unwrapMessage({ readInt32BE: () => -100, toString: () => "2017-03-01" }, "Pierre Edouard")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst._unwrapMessage({ readInt32BE: () => 0, toString: () => "2020-06-01" }, "Jean-Philippe")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst._unwrapMessage(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
