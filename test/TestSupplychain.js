// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
const SupplyChain = artifacts.require('SupplyChain');

contract('SupplyChain', async accounts => {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    let sku = 1;
    let upc = 1;
    // const ownerID = accounts[0];
    const originFarmerID = accounts[1];
    const originFarmName = "John Doe";
    const originFarmInformation = "Yarray Valley";
    const originFarmLatitude = "-38.239770";
    const originFarmLongitude = "144.341490";
    let productID = sku + upc;
    const productNotes = "Best beans for Espresso";
    const productPrice = web3.utils.toWei("1", "microether");
    const distributorID = accounts[2];
    const retailerID = accounts[3];
    const consumerID = accounts[4];
    const emptyAddress = '0x00000000000000000000000000000000000000';

    ///Available Accounts
    ///==================
    ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
    ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
    ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
    ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
    ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
    ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
    ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
    ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
    ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
    ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    let supplyChain;

    before(async () => {
        supplyChain = await SupplyChain.deployed();
        await Promise.all([
            supplyChain.addFarmer(originFarmerID),
            supplyChain.addDistributor(distributorID),
            supplyChain.addRetailer(retailerID),
            supplyChain.addConsumer(consumerID)
        ]);
    });

    describe('When coffee is harvested', async function () {
        let eventEmitted = false;
        before(async () => {
            let event = supplyChain.Harvested();
            event.on('data', () => {
                eventEmitted = true;
            });
        });

        it('harvests without error', async function () {
            await supplyChain.harvestItem(
                upc,
                originFarmerID,
                originFarmName,
                originFarmInformation,
                originFarmLatitude,
                originFarmLongitude,
                productNotes);
        });

        it('item has correct data', async function () {
            const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
            assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
            assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
            assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID');
            assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID');
            assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName');
            assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation');
            assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude');
            assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude');
        });

        it('item has correct state', async function () {
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
            assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State');
        });

        it('emits correct event', async function () {
            assert.equal(eventEmitted, true, 'Event was not emitted');
        });

        // it('does not allow to harvest it again', async function () {
        //
        // });
    });

    describe('When coffee is processed', async function () {
        let eventEmitted = false;
        before(async function () {
            let event = supplyChain.Processed();
            event.on('data', () => {
                eventEmitted = true;
            });
        });

        it('forbids to process by non-farmer', async function () {
            try {
                await supplyChain.processItem(upc, {from: distributorID});
                assert.fail("Should not allow to process");
            } catch (error) {
                assert.equal("Not a farmer", error.reason);
            }
        });

        it('processes without error', async function () {
            await supplyChain.processItem(upc, {from: originFarmerID});
        });

        it('item has correct state', async function () {
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);
            assert.equal(resultBufferTwo[5], 1, 'Expected "Processed" state');
        });

        it('emits correct event', async function () {
            assert.equal(eventEmitted, true, 'Event was not emitted');
        });


    });

    describe('When coffee is packed', async function () {
        let eventEmitted = false;
        before(async function () {
            let event = supplyChain.Packed();
            event.on('data', () => {
                eventEmitted = true;
            });
        });

        it('forbids to pack by non-farmer', async function () {
            try {
                await supplyChain.packItem(upc, {from: distributorID});
                assert.fail("Should not allow to pack");
            } catch (error) {
                assert.equal("Not a farmer", error.reason);
            }
        });

        it('processes without error', async function () {
            await supplyChain.packItem(upc, {from: originFarmerID});
        });

        it('item has correct state', async function () {
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);
            assert.equal(resultBufferTwo[5], 2, 'Expected "Packed" state');
        });

        it('emits correct event', async function () {
            assert.equal(eventEmitted, true, 'Event was not emitted');
        });
    });

    describe('When coffee is set for sale', async function () {
        let eventEmitted = false;
        before(async function () {
            let event = supplyChain.ForSale();
            event.on('data', () => {
                eventEmitted = true;
            });
        });

        it('forbids selling by non-farmer', async function () {
            try {
                await supplyChain.sellItem(upc, productPrice, {from: distributorID});
                assert.fail("Should not allow to sell");
            } catch (error) {
                assert.equal("Not a farmer", error.reason);
            }
        });

        it('sells without error', async function () {
            await supplyChain.sellItem(upc, productPrice, {from: originFarmerID});
        });

        it('item has correct details', async function () {
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);
            assert.equal(resultBufferTwo[5], 3, 'Expected "ForSale" state');
            assert.equal(resultBufferTwo[4], productPrice, 'Expected "ForSale" state');
        });

        it('emits correct event', async function () {
            assert.equal(eventEmitted, true, 'Event was not emitted');
        });
    })

    describe('When coffee is bought', async function () {
        let eventEmitted = false;
        let value = productPrice + 3000;
        before(async function () {
            let event = supplyChain.Sold();
            event.on('data', () => {
                eventEmitted = true;
            });
        });

        it('forbids buying by non-distributor', async function () {
            try {
                await supplyChain.buyItem(upc, {from: originFarmerID, value});
                assert.fail("Should not allow to buy");
            } catch (error) {
                assert.equal("Not a distributor", error.reason);
            }
        });

        it('checks insufficient funds', async function () {
            try {
                await supplyChain.buyItem(upc, {from: distributorID, value: productPrice - 3000});
                assert.fail("Should not allow to buy");
            } catch (error) {
                assert.equal("Not enough funds", error.reason);
            }
        });

        it('buys without error', async function () {
            await supplyChain.buyItem(upc, {from: distributorID, value});
        });

        it('item has correct owner', async function () {
            const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
            assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID');
        });

        it('item has correct details', async function () {
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);
            assert.equal(resultBufferTwo[5], 4, 'Expected "Sold" state');
            assert.equal(resultBufferTwo[6], distributorID, 'Expected distributor to be presented');
        });

        it('emits correct event', async function () {
            assert.equal(eventEmitted, true, 'Event was not emitted');
        });
    });

    describe('When coffee is shipped', async function () {
        let eventEmitted = false;
        before(async function () {
            let event = supplyChain.Shipped();
            event.on('data', () => {
                eventEmitted = true;
            });
        });

        it('forbids shipping by non-distributor', async function () {
            try {
                await supplyChain.shipItem(upc, {from: retailerID});
                assert.fail("Should not allow to ship");
            } catch (error) {
                assert.equal("Not a distributor", error.reason);
            }
        });

        it('ships without error', async function () {
            await supplyChain.shipItem(upc, {from: distributorID});
        });

        it('item has correct state', async function () {
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);
            assert.equal(resultBufferTwo[5], 5, 'Expected "Shipped" state');
        });

        it('emits correct event', async function () {
            assert.equal(eventEmitted, true, 'Event was not emitted');
        });
    });

    describe('When coffee is received', async function () {
        let eventEmitted = false;
        before(async function () {
            let event = supplyChain.Received();
            event.on('data', () => {
                eventEmitted = true;
            });
        });

        it('forbids receiving by non-retailer', async function () {
            try {
                await supplyChain.receiveItem(upc, {from: consumerID});
                assert.fail("Should not allow to receive");
            } catch (error) {
                assert.equal("Not a retailer", error.reason);
            }
        });

        it('receives without error', async function () {
            await supplyChain.receiveItem(upc, {from: retailerID});
        });

        it('item has correct owner', async function () {
            const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
            assert.equal(resultBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID');
        });

        it('item has correct details', async function () {
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);
            assert.equal(resultBufferTwo[5], 6, 'Expected "Received" state');
            assert.equal(resultBufferTwo[7], retailerID, "Expected correct retailerId");
        });

        it('emits correct event', async function () {
            assert.equal(eventEmitted, true, 'Event was not emitted');
        });
    });

    describe('When coffee is purchased', async function () {
        let eventEmitted = false;
        before(async function () {
            let event = supplyChain.Purchased();
            event.on('data', () => {
                eventEmitted = true;
            });
        });

        it('forbids to shipping by non-consumer', async function () {
            try {
                await supplyChain.purchaseItem(upc, {from: originFarmerID});
                assert.fail("Should not allow to purchase");
            } catch (error) {
                assert.equal("Not a consumer", error.reason);
            }
        });

        it('purchases without error', async function () {
            await supplyChain.purchaseItem(upc, {from: consumerID});
        });

        it('item has correct owner', async function () {
            const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
            assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID');
        });

        it('item has correct details', async function () {
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);
            assert.equal(resultBufferTwo[5], 7, 'Expected "Purchased" state');
            assert.equal(resultBufferTwo[8], consumerID, "Expected correct consumerId");
        });

        it('emits correct event', async function () {
            assert.equal(eventEmitted, true, 'Event was not emitted');
        });
    });
});

