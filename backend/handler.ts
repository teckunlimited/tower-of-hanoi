/**
 * Tower of Hanoi AWS Lambda Handler (TypeScript Version)
 * Solves the Tower of Hanoi puzzle recursively
 */

// Type definitions for AWS Lambda
interface LambdaEvent {
  httpMethod?: string;
  body?: string | null;
  [key: string]: any;
}

interface LambdaContext {
  requestId: string;
  functionName: string;
  [key: string]: any;
}

interface LambdaResponse {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
}

// Solution types
interface SolutionResponse {
  total_moves: number;
  moves: string[];
  formula: string;
  n: number;
  generated_at: string;
  message?: string;
}

interface SolveRequest {
  disks: number;
  source?: string;
  auxiliary?: string;
  target?: string;
}

/**
 * Recursive solver for Tower of Hanoi puzzle
 */
class HanoiSolver {
  private moves: string[] = [];
  private moveCount: number = 0;

  /**
   * Recursive solution to Tower of Hanoi
   * @param n - Number of disks
   * @param source - Source rod name
   * @param auxiliary - Auxiliary rod name
   * @param target - Target rod name
   */
  private solve(n: number, source: string, auxiliary: string, target: string): void {
    if (n === 1) {
      this.moves.push(`Move disk 1 from ${source} to ${target}`);
      this.moveCount++;
      return;
    }

    // Move n-1 disks from source to auxiliary using target
    this.solve(n - 1, source, target, auxiliary);

    // Move the largest disk from source to target
    this.moves.push(`Move disk ${n} from ${source} to ${target}`);
    this.moveCount++;

    // Move n-1 disks from auxiliary to target using source
    this.solve(n - 1, auxiliary, source, target);
  }

  /**
   * Get complete solution for Tower of Hanoi
   * @param n - Number of disks
   * @param source - Source rod name
   * @param auxiliary - Auxiliary rod name
   * @param target - Target rod name
   * @returns Solution details
   */
  public getSolution(n: number, source: string, auxiliary: string, target: string): SolutionResponse {
    this.moves = [];
    this.moveCount = 0;

    // Only generate full move list for n <= 12
    if (n <= 12) {
      this.solve(n, source, auxiliary, target);
      return {
        total_moves: this.moveCount,
        moves: this.moves,
        formula: "2^n - 1",
        n: n,
        generated_at: new Date().toISOString(),
      };
    } else {
      // For n > 12, only calculate total moves
      const total = Math.pow(2, n) - 1;
      return {
        total_moves: total,
        moves: [],
        message: "Full list too large - showing move count only",
        formula: "2^n - 1",
        n: n,
        generated_at: new Date().toISOString(),
      };
    }
  }
}

/**
 * AWS Lambda handler for Tower of Hanoi solver
 * @param event - Lambda event object
 * @param context - Lambda context object
 * @returns HTTP response
 */
export const handler = async (event: LambdaEvent, context: LambdaContext): Promise<LambdaResponse> => {
  // CORS headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With",
    "Access-Control-Allow-Methods": "POST,OPTIONS,GET",
    "Access-Control-Max-Age": "86400",
  };

  try {
    // Handle OPTIONS preflight request
    const httpMethod = event.httpMethod?.toUpperCase() || "";
    
    if (httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "OK" }),
      };
    }

    // Handle GET request (for testing)
    if (httpMethod === "GET") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "Tower of Hanoi API is running (TypeScript)",
          endpoint: "/solve",
          method: "POST",
          example: { disks: 3 },
        }),
      };
    }

    // Parse request body for POST
    let body: SolveRequest;
    
    if (typeof event.body === "string") {
      body = JSON.parse(event.body);
    } else {
      body = (event.body as any) || {};
    }

    // Validate input
    if (!("disks" in body)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Missing required field: disks",
          message: "Please provide the number of disks (1-20)",
        }),
      };
    }

    const disks = body.disks;

    // Validate disk count
    if (!Number.isInteger(disks) || disks < 1) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Invalid disk count",
          message: "Disks must be a positive integer",
        }),
      };
    }

    if (disks > 20) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Too many disks",
          message: "Maximum 20 disks allowed (20 disks = 1,048,575 moves)",
        }),
      };
    }

    // Get rod names (with defaults)
    const source = body.source || "A";
    const auxiliary = body.auxiliary || "B";
    const target = body.target || "C";

    // Validate rod names
    const rods = [source, auxiliary, target];
    if (!rods.every(rod => typeof rod === "string" && rod.length > 0)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Invalid rod names",
          message: "Rod names must be non-empty strings",
        }),
      };
    }

    // Solve the puzzle
    const solver = new HanoiSolver();
    const solution = solver.getSolution(disks, source, auxiliary, target);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(solution),
    };
  } catch (error) {
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Invalid JSON",
          message: "Request body must be valid JSON",
        }),
      };
    }

    // Handle other errors
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

// For local testing
if (require.main === module) {
  const testEvent: LambdaEvent = {
    httpMethod: "POST",
    body: JSON.stringify({ disks: 5 }),
  };

  const testContext: LambdaContext = {
    requestId: "test-request-id",
    functionName: "tower-of-hanoi-test",
  };

  handler(testEvent, testContext).then((response) => {
    console.log("Response:", JSON.stringify(response, null, 2));
  });
}
