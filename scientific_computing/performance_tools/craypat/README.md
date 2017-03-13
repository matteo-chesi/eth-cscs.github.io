# CrayPAT

CrayPat is the recommended performance analysis tool developed by Cray for
CSCS production systems.

CrayPat provides detailed information about application performance.
It can be used for profiling, tracing and hardware performance counter based
analysis. It also provides access to a wide variety of performance experiments
that measure how an executable program consumes resources while it is running,
as well as several different user interfaces that provide access to the
experiment and reporting functions.

CrayPat consists of the following main components:

* `perftools-lite` - a simplified, easy-to-use version of the Cray Performance Measurement and Analysis toolset,
* `pat_build` - used to instrument the program to be analyzed,
* `pat_report` - a standalone text report generator that can be use to further explore the data generated by instrumented program execution,
* `Apprentice2` - a graphical analysis tool that can be used, in addition to
pat_report to further explore and visualize the data generated by instrumented
program execution.  
* `Reveal` - Reveal helps to identify top time consuming loops, with compiler feedback on dependency and vectorization.

## Troubleshooting

Please refer to Cray https://pubs.cray.com/ documentation for more details.

For further information, `module load perftools-base` and then read the following
man page: `man intro_craypat` or run the command `pat_help`.

In case of questions/remarks, please contact us at [help@cscs.ch](mailto:help@cscs.ch)
