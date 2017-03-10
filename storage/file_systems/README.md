# File Systems

CSCS supports different file systems, whose specifications are summarized in the table below:
	
 | /scratch (PizDaint) | /scratch (Clusters) | /users | /project | /store
 --- | --- | --- | --- | --- | --- 
Type | Lustre | GPFS | GPFS | GPFS | GPFS
Quota |	Soft (1M files) | None | 10GB/user and 100K files | 50K files/TB | Contract
Expiration | 30 days | 30 days | None | End of the project | Contract
Data Backup | None | None | Active | Active | Active
Access Speed | Fast | Fast | Slow  | Medium | Slow
Capacity | 6.2 PB | 1.4 PB | 86 TB | 5.7 PB | 4.4 PB

## /scratch

All users have a personal folder under the [/scratch](scratch) file system.

## /users

Each user has a personal home folder under the [/users](users) file system.

## /project

Production projects proposals can ask for group storage under the [/project](project) file system.

## /store

Contractual partners can buy dedicated storage under the [/store](store) file system.
