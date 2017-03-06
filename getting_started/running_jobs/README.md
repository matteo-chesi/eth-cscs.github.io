# Running jobs

All CSCS systems use the SLURM batch system for the submission, control and management of user jobs.

[SLURM](https://computing.llnl.gov/linux/slurm/) provides a rich set of features for organizing your workload and provides an extensive array of tools for managing your resource usage, however in normal interaction with the batch system you only need to know three basic commands:

* __sbatch__ - submit a batch script
* __squeue__ - check the status of jobs on the system
* __scancel__ - delete one of your jobs from the queue

An appropriate SLURM job submission file for your parallel job is a shell script with a set of directives at the beginning. These directives are issued by starting a line with the string "#SBATCH" (as a note for former PBS batch system users, this is the SLURM equivalent of "#PBS"). A suitable batch script is then submitted to the batch system using the 'sbatch' command.
Let us remind you that your account will be charged per node usage on most systems, whether you submit batch jobs with sbatch or you use interactive sessions with salloc (please have a look at the corresponding man pages for more details). Interactive allocations (salloc sessions) are for debugging only, and have a maximum wall time of one hour.

A basic batch script can be written just using the '--ntasks' and '--time' directives, but extra directives will give you more control on how your job is run.

## Output and Error

By default the output of your script will be put into a file of the form slurm-<XXXX>.out where <XXXX> is the SLURM batch job number of your job, and the error will be put into a file called slurm-<XXXX>.err with both of these being placed in the directory from which you launched the job.

Note that with SLURM the output file is created as soon as your job starts running, and the output from your job is placed in this file as the job progresses so that you can monitor your job's progress. Therefore do not delete this file while your job is running or else you will lose your output. You should also keep in mind that SLURM performs file buffering by default when writing on the output files. In practice, this means that the output of your job will not appear in the output files immediately. If you want to override this behaviour, you should pass the '-u' or '--unbuffered' to the srun command; the output then will appear in the file as soon as it is produced.

As the default names for the output and error files are not very meaningful, you might wish to change them, and in this case you can use the "--output" and "--error" directives in your batch script that you can run with sbatch.

```
#!/bin/bash -l
#
#SBATCH --job-name="hello_world_mpi"
#SBATCH --time=00:05:00
#SBATCH --nodes=2
#SBATCH --ntasks-per-node=32
#SBATCH --output=hello_world_mpi.%j.o
#SBATCH --error=hello_world_mpi.%j.e

module load slurm
srun ./hello_world_mpi.x
```

## Migration from Cray ALPS to native SLURM

Cray systems are equipped with native SLURM: the main difference is the absence of aprun, which was replaced by the SLURM command srun. The migration from Cray ALPS (Application Level Placement Scheduler) to native SLURM is supported by the simple examples available below for the most common usage with MPI and hybrid MPI/OpenMP jobs.
SLURM man pages (e.g man sbatch) will give useful information and more details on specific options, along with the documentation available on line at: http://slurm.schedmd.com/documentation.html.

Advanced users might also be interested in consulting the presentations available on line from the Slurm User Group meeting, which cover the new features of the latest SLURM release: http://slurm.schedmd.com/publications.html.

```
#!/bin/bash -l
#
#SBATCH --nodes=2
#SBATCH --ntasks=16
#SBATCH --ntasks-per-node=8
#SBATCH --ntasks-per-core=2
#SBATCH --cpus-per-task=2
#SBATCH --gres=gpu:1
#SBATCH --time=00:30:00

srun -n $SLURM_NTASKS --ntasks-per-node=$SLURM_NTASKS_PER_NODE -c $SLURM_CPUS_PER_TASK --cpu_bind=rank ./myprogram.exe 
```

The example above shows an MPI job allocated on two nodes using hyperthreading on Piz Daint.
You might need to use the SLURM option --constraint=gpu to run on the XC50 using the GPU accelerator on each node. With the exception of the gpu flag, the same srun options apply on XC40, where you need to adjust the number of cores of the Broadwell compute node, featuring two sockets with eighteen cores each. The flag -l at the beginning allows you to call the module command within the script, in case you need it.

```
#!/bin/bash -l
#
#SBATCH --time=00:30:00
#SBATCH --nodes=2
#SBATCH --ntasks=4
#SBATCH --ntasks-per-node=2
#SBATCH --cpus-per-task=18
#SBATCH --contstraint=mc

srun -n $SLURM_NTASKS --ntasks-per-node=$SLURM_NTASKS_PER_NODE -c $SLURM_CPUS_PER_TASK --hint=nomultithread ./test.mpi
```

The SLURM script above shows how to run a hybrid job with two MPI tasks per node, spawning eighteen threads per socket on a two-sockets Broadwell compute node.
The srun option --hint=nomultithread will avoid using extra threads with in-core multi-threading, a configuration that can benefit communication intensive applications (see man srun for further details).

```
export PMI_MMAP_SYNC_WAIT_TIME=300
srun --wait 200 --bcast=/tmp/hello-world.${ARCH} $HOME/jobs/bin/daint/hello-world.${ARCH}
```

The example above shows what needs to be done to run large MPI jobs:
- PMI_MMAP_SYNC_WAIT_TIME and srun option --wait prevent Slurm from killing tasks that take long time to run
- srun's option --bcast copies the binary to /tmp on all nodes before launching them. This helps task startup time.

## Synoptic table
Option |	aprun | srun
--- | --- | ---
MPI tasks | -n | -n, --ntasks
MPI tasks per node | -N | --ntasks-per-node
CPUs per task |	-d | -c, --cpus-per-task
Thread/task affinity | -cc cpu |--cpu_bind=rank
Large memory nodes | -q bigmem |--mem=120GB

The other SLURM commands will always be the same: the list of queues and partitions is available typing sinfo or scontrol show partition, the SLURM queue can be monitored with the squeue command and the jobs saved in the SLURM database can be inspected with the sacct command.
