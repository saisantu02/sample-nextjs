
const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const ecs = require("@aws-cdk/aws-ecs");
const path = require("path");
const ecs_patterns = require("@aws-cdk/aws-ecs-patterns");

// Stack properties - what region to deploy to
const props = {
  env: {
    region: "ap-south-1",
    account: "574935813360"
  }
};

class SJSCdkStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    // The code that defines your stack goes here

    // IAM inline role - the service principal is required
    const taskRole = new iam.Role(this, "sample-fargate-role", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com")
    });

    // Define a fargate task with the newly created execution and task roles
    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "sample-fargate-task-definition",
      {
        taskRole: taskRole,
        executionRole: taskRole
      }
    );

    // Import a local docker image and set up logger
    const container = taskDefinition.addContainer(
      "sample-fargate-task-container",
      {
        image: ecs.ContainerImage.fromRegistry(
          "public.ecr.aws/m0z6o0u5/sample-nextjs"
        ),
        logging: new ecs.AwsLogDriver({
          streamPrefix: "sample-fargate"
        })
      }
    );

    container.addPortMappings({
      containerPort: 80,
      hostPort: 80,
      protocol: ecs.Protocol.TCP
    });

    // NOTE: I've been creating a new VPC in us-east-2 (Ohio) to keep it clean, so se that at the top in stackProps
    // Create a vpc to hold everything - this creates a brand new vpc
    // Remove this if you are using us-east-1 and the existing non-prod vpc as commented out below
    const vpc = new ec2.Vpc(this, "sample-fargate-task-vpc", {
      maxAzs: 2,
      natGateways: 1
    });

    // Create the cluster
    const cluster = new ecs.Cluster(this, "sample-fargate-task-cluster", { vpc });

    // Create a load-balanced Fargate service and make it public
    new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "sample-fargate-loadbalancer",
      {
        cluster: cluster, // Required
        cpu: 512, // Default is 256
        desiredCount: 2, // Default is 1
        taskDefinition: taskDefinition,
        memoryLimitMiB: 2048, // Default is 512
        publicLoadBalancer: true // Default is false
      }
    );
  }
}

module.exports = { SJSCdkStack };