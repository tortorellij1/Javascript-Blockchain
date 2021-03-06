const SHA256 = require('crypto-js/sha256');
class Block { 
    constructor(index, timestamp, data, previousHash = '') { 
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = '';
        this.nonce = 0;
    }

    calculateHash() { 
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) { 
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("block mined: " + this.hash);
    }
}

class Blockchain{
    constructor() { 
        this.chain = [this.createGenesisBlock];
        this.difficulty = 4;
    }

    createGenesisBlock() {
        return new Block(
            0, "01/01/2017", "Genesis Block", "0"
        );
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() { 
        for (let i = 1; i < this.chain.length-1; i++) { 
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){ 
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let c = new Blockchain();
console.log('Mining block 1 ' );
c.addBlock(new Block(1, "1/2/2017", 1));
console.log('Mining block 2 ' );
c.addBlock(new Block(2, "1/3/2017", 2));
console.log('Mining block 3 ' );
c.addBlock(new Block(3, "1/4/2017", 3));

console.log('is blockchain valid? ' + c.isChainValid());

console.log('is blockchain valid? ' + c.isChainValid());

console.log(JSON.stringify(c, null, 4));