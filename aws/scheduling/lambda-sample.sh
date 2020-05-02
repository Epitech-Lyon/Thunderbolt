#!/bin/sh

#
# A sample for lambda scheduling
# call at 8am and 8pm every days
#

scheduling="0 8,20 * * *"
rulename="thunderbolt-rule-workday"

# Variables required : 
# lambdaID

set -e

trap RAISE EXIT

echo "-------- Deploy scheduling --------"

aws events put-rule                             \
    --name $rulename                            \
    --schedule-expression "cron($scheduling)"   \

echo "We are done !"

trap - EXIT