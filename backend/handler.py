"""
Tower of Hanoi AWS Lambda Handler
Solves the Tower of Hanoi puzzle recursively
"""
import json
from datetime import datetime
from typing import List, Dict, Any


class HanoiSolver:
    """Recursive solver for Tower of Hanoi puzzle"""
    
    def __init__(self):
        self.moves: List[str] = []
        self.move_count = 0
    
    def solve(self, n: int, source: str, auxiliary: str, target: str) -> None:
        """
        Recursive solution to Tower of Hanoi
        
        Args:
            n: Number of disks
            source: Source rod name
            auxiliary: Auxiliary rod name
            target: Target rod name
        """
        if n == 1:
            self.moves.append(f"Move disk 1 from {source} to {target}")
            self.move_count += 1
            return
        
        # Move n-1 disks from source to auxiliary using target
        self.solve(n - 1, source, target, auxiliary)
        
        # Move the largest disk from source to target
        self.moves.append(f"Move disk {n} from {source} to {target}")
        self.move_count += 1
        
        # Move n-1 disks from auxiliary to target using source
        self.solve(n - 1, auxiliary, source, target)
    
    def get_solution(self, n: int, source: str, auxiliary: str, target: str) -> Dict[str, Any]:
        """
        Get complete solution for Tower of Hanoi
        
        Args:
            n: Number of disks
            source: Source rod name
            auxiliary: Auxiliary rod name
            target: Target rod name
            
        Returns:
            Dictionary with solution details
        """
        self.moves = []
        self.move_count = 0
        
        # Only generate full move list for n <= 12
        if n <= 12:
            self.solve(n, source, auxiliary, target)
            return {
                "total_moves": self.move_count,
                "moves": self.moves,
                "formula": "2^n - 1",
                "n": n,
                "generated_at": datetime.utcnow().isoformat() + "Z"
            }
        else:
            # For n > 12, only calculate total moves
            total = (2 ** n) - 1
            return {
                "total_moves": total,
                "moves": [],
                "message": "Full list too large - showing move count only",
                "formula": "2^n - 1",
                "n": n,
                "generated_at": datetime.utcnow().isoformat() + "Z"
            }


def lambda_handler(event, context):
    """
    AWS Lambda handler for Tower of Hanoi solver
    
    Expected input:
        {
            "disks": number (1-20),
            "source": string (optional, default "A"),
            "auxiliary": string (optional, default "B"),
            "target": string (optional, default "C")
        }
    
    Returns:
        {
            "statusCode": 200,
            "headers": {...},
            "body": JSON string with solution
        }
    """
    
    # CORS headers
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With",
        "Access-Control-Allow-Methods": "POST,OPTIONS,GET",
        "Access-Control-Max-Age": "86400"
    }
    
    try:
        # Handle OPTIONS preflight request
        http_method = event.get('httpMethod', '').upper()
        if http_method == 'OPTIONS':
            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps({"message": "OK"})
            }
        
        # Handle GET request (for testing)
        if http_method == 'GET':
            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps({
                    "message": "Tower of Hanoi API is running",
                    "endpoint": "/solve",
                    "method": "POST",
                    "example": {"disks": 3}
                })
            }
        
        # Parse request body for POST
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event.get('body', {})
        
        # Validate input
        if 'disks' not in body:
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({
                    "error": "Missing required field: disks",
                    "message": "Please provide the number of disks (1-20)"
                })
            }
        
        disks = body['disks']
        
        # Validate disk count
        if not isinstance(disks, int) or disks < 1:
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({
                    "error": "Invalid disk count",
                    "message": "Disks must be a positive integer"
                })
            }
        
        if disks > 20:
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({
                    "error": "Too many disks",
                    "message": "Maximum 20 disks allowed (20 disks = 1,048,575 moves)"
                })
            }
        
        # Get rod names (with defaults)
        source = body.get('source', 'A')
        auxiliary = body.get('auxiliary', 'B')
        target = body.get('target', 'C')
        
        # Validate rod names
        if not all(isinstance(rod, str) and rod for rod in [source, auxiliary, target]):
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({
                    "error": "Invalid rod names",
                    "message": "Rod names must be non-empty strings"
                })
            }
        
        # Solve the puzzle
        solver = HanoiSolver()
        solution = solver.get_solution(disks, source, auxiliary, target)
        
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps(solution)
        }
    
    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({
                "error": "Invalid JSON",
                "message": "Request body must be valid JSON"
            })
        }
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({
                "error": "Internal server error",
                "message": str(e)
            })
        }
