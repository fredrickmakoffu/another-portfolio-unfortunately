class Node {
    constructor(data, color) {
      this.data = data;
      this.color = color;
      this.next = null;
    }
}
  
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    // Add a new node to the end of the list
    append(data, color) {
        const newNode = new Node(data, color);

        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            
            while (current.next) {
                current = current.next;
            }
            
            current.next = newNode;
        }
        
        this.size++;
    }

    // Insert a new node at a specific index
    insert(data, color, index) {
        if (index < 0 || index > this.size) {
            return console.log("Invalid index");
        }

        const newNode = new Node(data, color);

        if (index === 0) {
            newNode.next = this.head;
            this.head = newNode;
        } else {
            let current = this.head;
            let prev = null;
            let i = 0;

            while (i < index) {
                prev = current;
                current = current.next;
                i++;
            }

            newNode.next = current;
            prev.next = newNode;
        }

        this.size++;
    }

    // Remove a node at a specific index
    removeAt(index) {
        if (index < 0 || index >= this.size) {
            return console.log("Invalid index");
        }

        let current = this.head;
        let prev = null;
        let i = 0;

        if (index === 0) {
            this.head = current.next;
        } else {
            while (i < index) {
                prev = current;
                current = current.next;
                i++;
            }

            prev.next = current.next;
        }

        this.size--;

        return current.data;
    }

    // Print the list
    printList() {
        let current = this.head;
        let result = "";

        while (current) {
            result += `{ data: ${current.data}, color: ${JSON.stringify(current.color)} } -> `;
            current = current.next;
        }

        result += "null";
        console.log(result);
    }

    getNode(index) {
        if (index < 0 || index >= this.size) {
           return console.log("Invalid index");
        }

        let current = this.head;
        let i = 0;

        while (i < index) {
            current = current.next;
            i++;
        }

        return current;
    }
}

export { Node, LinkedList };

// // Example usage:
// const list = new LinkedList();

// list.append(1, {
//     color: "#ff0000"
// });  
// list.append(2, {
//     color: "#00ff00"
// });  
// list.append(3, {
//     color: "#0000ff"
// }); 

// list.printList();

// list.insert(4, "#333", 2); // Insert { data: 4, color: "#ffff00" } at index 2

// list.printList(); // Output: { data: 1, color: #ff0000 } -> { data: 2, color: #00ff00 } -> { data: 4, color: #ffff00 } -> { data: 3, color: #0000ff } -> null

// list.removeAt(1); // Remove the node at index 1

// list.printList(); // Output: { data: 1, color: #ff0000 } -> { data: 4, color: #ffff00 } -> { data: 3, color: #0000ff } -> null