import hashlib

class MerkleTree:
    """
        `The Merkle Tree is a special kind of Binary Tree that allows the user to prevent 
        information malleability and preserve integrity by using cryptographically secure
        hash functions. By providing leaves you create a root by concatination and hashingself.
        If the root is mutated it means that the data inside the leaves was changed. You can also
        derive cryptographic proofs that a piece of data is inside the tree`

        Comments:
           Complexities - This part can be improved by doing couple of modifications 
    """


    class __Node:

        def __init__(self, item=None, left=None, right=None):
            """
            `Merkle Node constructor. Used for storing the left and right node pointersself.`

            Args:
                item (bytes): Bytes object that represents the hashed value that resides in the current node
                left (Node): Reference to the left subtree or a None value if current node is leaf
                right (Node): Reference to the right subtree or a None value if current node is leaf
            """
            self.left = left
            self.right = right
            self.__value = item

        @property
        def value(self):
            return self.__value

        @value.setter
        def value(self, value):
            self.__value = value

        def __str__(self):
            return 'Value: {0}'.format(self.value)
        
        def __repr__(self):
            return self.__str__() + '\n\t' + self.left.__repr__() + '\n\t' + self.right.__repr__()

    
    def __init__(self,
                 iterable,
                 digest_delegate=lambda x: str(x)):
        """
            `Merkle Tree constructor`
        
            Args:
                iterable (list_iterator): The collection you want to create the root from
                digest_delegate (function): ~
                  ~ A delegate (reference to function) that returns the digest of a passed in argument
        """
        self.digest = digest_delegate
        self.__root = self.build_root(iterable)
        self.leaves = []
  
    @property
    def root(self):
        return self.__root

    def __build_root(self, iterable):
        """
        `Build the actual Merkle Root. Actually build the next level, and repeat until reaching the root.`
        """
        ilen = len(iterable)
        if ilen == 1:
            # root level found! lets get out of here.
            return iterable[0]
        elif ilen % 2 != 0:
            iterable.append(iterable[-1])
        it = []
        # iterate over the iterable in steps of 2
        for i in range(0, ilen, 2):
            # create new node with hash of left and right
            it.append(self.__Node(self.digest(iterable[i].value + iterable[i + 1].value), left=iterable[i], right=iterable[i + 1]))
        # call again with nodes just creatd, until we reach the root level
        return self.__build_root(it)

    def build_root(self, iterable):
        """
            `This method builds a Merkle Root from the passed in iterable.
             After the data is preprocessed, it calls the internal __build_root
             function to build the actual Merkle Root.`
            
            Args:
                iterable (list_iterator): The collection you want to create the root from
            
            Returns:
                Node: The newly built root of the Merkle Tree
        """
        ilen = len(iterable)

        # When size is 1 the root is the only node that is left
        if ilen == 0:
            raise TypeError('There is no tree.')
        if ilen == 1:
            self.leaves = [self.__Node(self.digest(iterable[0]))]
            return self.leaves[0]
        # Double the last node if the size is odd
        elif ilen % 2 != 0:
            iterable.append(iterable[-1])

        # digest and save the leaves
        self.leaves = list(map(lambda x: self.__Node(self.digest(x)), iterable))

        # Iterate over the collection and create the upper layers till the root is reached
        return self.__build_root(self.leaves)
        
    def contains(self, value):
        """
            `The contains method checks whether the item passed in as an argument is in the
            tree and returns True/False. It is used only externally. It's internal equivalent
            is __find`

            Args:
                value (object): The value you are searching for

            Returns:
                bool: The result of the search

            Complexity:
                O(n)
        """
        if value is None or self.root is None:
            return False

        hashed_value = self.digest(value)

        return self.__find(self.root, hashed_value) is not None 

    def __find(self, node, value):
        """
            `Find is the internal equivalent of the contains method`

            Args:
                value (object): The value you are searching for

            Returns:
                bool: The result of the search

            Complexity:
                O(n)
        """
        if node is None:
            return None

        if node.value == value:
            return node
        
        return self.__find(node.left, value) or self.__find(node.right, value)

    def request_proof(self, value):
        """
            `The request_proof method provides to the caller a merkle branch in order to prove
            that the integrity of the data is in tact. The caller can use the same digest and 
            verify it himself`

            Args:
               value (object) - The item you want proof for

            Returns:
               list - Python list containing the merkle branch (proof) in the form of tuples

            Throws:
                Exception - On invalid value or one that is not contained in the tree
        """
        # Hash the value
        h = self.digest(value)

        # Check if it is contained within the tree
        isin = self.contains(value)
        if (not isin):
            raise Exception('404, SOS, value not found!')

        # Start building the proof
        proof = []
        
        self.__build_valid_proof(self.root, h, proof)

        if len(proof) != 0:
            proof.insert(0, (0 if proof[1][0] else 1, h))

        return proof

    def __build_valid_proof(self, node, value, proof):
        if node is None:
            return False

        # found it!
        elif node.value == value:
            return True

        # Traverse left and right to find the correct leaf node
        left = self.__build_valid_proof(node.left, value, proof)
        right = self.__build_valid_proof(node.right, value, proof)

        # not found anywhere uptree...
        if not left and not right:
            return False
        # If it was both found on the left and on the right -> it means that left and right values are identical
        # Do not add to the list
        if left and right and (0, node.left.value) in proof:
            return False
    
        # If the leaf was found in the left subtree -> add the right node to the proof list
        # Create tuple with the node value and the position it was found on
        # 0 for right node and 1 for left node e.g (1, node.left)    
        n = (0, node.right.value) if left else (1, node.left.value)

        # Append to the list
        proof.append(n)

        return True
        
    def dump(self, indent=0):
        
        if self.root is None:
            return

        self.__print(self.root, indent)

    def __print(self, node, indent):
        
        if node is None:
            return

        print('{0}Node: {1}'.format(' '*indent, node.value))    
        self.__print(node.left, indent+2)
        self.__print(node.right, indent+2)

    def __contains__(self, value):
        hashed_value = self.digest(value)
        return self.__find(self.root, hashed_value)

        
        
