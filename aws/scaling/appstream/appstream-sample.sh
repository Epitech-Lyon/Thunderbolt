#!/bin/sh

#
# A sample for appstream fleet auto-scaling
# capacity: 2 -> 8
# scaling down at 25% -> -1 instance
# scaling up   at 75% -> +1 instance
#

# Variables required : 
# fleet

function RAISE()
{
    echo "Process terminated, fatal error"
    exit 0
}

set -e

trap RAISE EXIT

echo "-------- Deploy scaling --------"

aws application-autoscaling register-scalable-target \
                    --service-namespace appstream \
                    --resource-id fleet/$fleet \
                    --scalable-dimension appstream:fleet:DesiredCapacity \
                    --min-capacity 2 --max-capacity 8 \

ScaleDownArn=$(aws application-autoscaling put-scaling-policy \
                    --policy-name ScalingDownPolicy \
                    --service-namespace appstream \
                    --resource-id fleet/$fleet \
                    --scalable-dimension appstream:fleet:DesiredCapacity \
                    --policy-type StepScaling \
                    --step-scaling-policy-configuration file://ScaleDown.json --output text)

aws cloudwatch put-metric-alarm \
                    --alarm-name AppStream-testing-ScalingDown \
                    --alarm-description "Alarm when Available Capacity > 2 during 30 mins" \
                    --metric-name AvailableCapacity \
                    --namespace AWS/AppStream \
                    --statistic Maximum \
                    --period 60 \
                    --threshold 2 \
                    --comparison-operator GreaterThanThreshold \
                    --dimensions "Name=appstream,Value=appstream:fleet:DesiredCapacity" \
                    --evaluation-periods 30 \
                    --alarm-actions $ScaleDownArn

ScaleUpArn=$(aws application-autoscaling put-scaling-policy \
                    --policy-name ScalingUpPolicy \
                    --service-namespace appstream \
                    --resource-id fleet/$fleet \
                    --scalable-dimension appstream:fleet:DesiredCapacity \
                    --policy-type StepScaling \
                    --step-scaling-policy-configuration file://ScaleUp.json --output text)
                    
aws cloudwatch put-metric-alarm \
                    --alarm-name AppStream-testing-ScalingUp \
                    --alarm-description "Alarm when Available Capacity < 2 during 5 mins" \
                    --metric-name AvailableCapacity \
                    --namespace AWS/AppStream \
                    --statistic Minimum \
                    --period 60 \
                    --threshold 2 \
                    --comparison-operator LessThanThreshold \
                    --dimensions "Name=appstream,Value=appstream:fleet:DesiredCapacity" \
                    --evaluation-periods 5 \
                    --alarm-actions $ScaleUpArn

echo "We are done !"

trap - EXIT