'use strict';

class LinkedList {
	constructor() {
		this.length = 0;
		this.head = null;
	}

	insert(nthPosition, value) {
		if (nthPosition < 0 || nthPosition > this.length) {
			throw new Error('Index error');
		}

		const newNode = {
			value,
		};

		if (nthPosition == 0) {
			newNode.next = this.head;
			this.head = newNode;
		} else {
			// Find the node which we want to insert after
			const node = this._findNthElement(nthPosition - 1);
			newNode.next = node.next;
			node.next = newNode;
		}

		this.length++;
	}

	_findItem(item) {
		let node = this.head;
		while (node && node.value != item) {
			node = node.next;
		}

		return node;
	}

	_findNthElement(nthElement) {
		let node = this.head;
		for (let i = 0; i < nthElement; i++) {
			node = node.next;
		}

		return node;
	}

	get(nthElement) {
		if (nthElement < 0 || nthElement >= this.length) {
			throw new Error('Index error');
		}

		return this._findNthElement(nthElement).value;
	}
}

module.exports = LinkedList;