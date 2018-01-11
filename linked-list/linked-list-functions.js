'use strict';

const _find = (linkedList, index) => {
	let node = linkedList.head;
	for (let i = 0; i < index; i++) {
		node = node.next;
	}
	return node;
};

// Retrieve from list
const retrieve = (linkedList, index) => {
	if (index < 0 || index >= linkedList.length) {
		throw new Error('Index Error');
	}
	const node = _find(linkedList, index);
	return node.value;
};

const remove = (linkedList, index) => {
	if (index < 0 || index >= linkedList.length) {
		throw new Error('Index Error');
	}
	if(index === 0){
		linkedList.head = linkedList.head.next;
	}
	else {
		let before = linkedList._find(linkedList, index - 1);
		before.next = before.next.next;
	}
	linkedList.length--;
};

// Insert to list
const insert = (linkedList, index, value) => {
	if (index < 0 || index > linkedList.length) {
		throw new Error('Index Error');
	}
	const newNode = {value};
	if (index === 0) {
		newNode.next = linkedList.head;
		linkedList.head = newNode;
	}
	else {
		let before = _find(linkedList, index-1);
		newNode.next = before.next;
		before.next = newNode;
	}
	linkedList.length++;
};

// Display list
function display(linkedList){
	let currNode = linkedList.head;
	if(!currNode){
		return 'List is Empty';
	}
	while (!(currNode.next === null)) {
		console.log(currNode.value);
		currNode = currNode.next;
	}
	console.log(currNode.value);
}

// Return size of list
function size(linkedList){
	let counter = 0;
	let currNode = linkedList.head;
	if(!currNode){
		return counter;
	}
	else
		counter++;
	while (!(currNode.next === null)) {
		counter++;
		currNode = currNode.next;
	}
	return counter;
}

module.exports = { retrieve, remove, insert, display, size };
